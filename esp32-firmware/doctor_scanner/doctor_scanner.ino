#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <Adafruit_Fingerprint.h>

// =========================
// User configuration
// =========================
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Use your deployed URL or local server URL.
// Examples:
// "https://medi-track-sable.vercel.app"
// "http://192.168.1.20:3000"
const char* SERVER_BASE_URL = "https://medi-track-sable.vercel.app";

// Copy this from Device Setup in the doctor account
const char* DEVICE_TOKEN = "PASTE_DOCTOR_DEVICE_TOKEN_HERE";

// Fingerprint UART pins on your ESP32 board
static const int FP_RX_PIN = 16;  // ESP32 receives from sensor TX (yellow wire)
static const int FP_TX_PIN = 17;  // ESP32 sends to sensor RX (green wire)

static const uint32_t POLL_INTERVAL_MS = 3000;

HardwareSerial fingerSerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&fingerSerial);

String lastMode = "idle";
unsigned long lastPollAt = 0;
bool sensorReady = false;

bool isHttpsUrl(const String& url) {
  return url.startsWith("https://");
}

String makeUrl(const char* path) {
  String url = String(SERVER_BASE_URL) + path;
  return url;
}

void connectWifi() {
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  Serial.print("Connecting to Wi-Fi");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long startedAt = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");

    if (millis() - startedAt > 30000) {
      Serial.println("\nWi-Fi timeout. Retrying...");
      WiFi.disconnect();
      delay(1000);
      WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
      startedAt = millis();
    }
  }

  Serial.println();
  Serial.print("Wi-Fi connected. IP: ");
  Serial.println(WiFi.localIP());
}

bool httpGetJson(const String& url, DynamicJsonDocument& doc) {
  HTTPClient http;
  WiFiClient plainClient;
  WiFiClientSecure secureClient;

  bool begun = false;
  if (isHttpsUrl(url)) {
    secureClient.setInsecure();
    begun = http.begin(secureClient, url);
  } else {
    begun = http.begin(plainClient, url);
  }

  if (!begun) {
    Serial.println("HTTP GET begin failed");
    return false;
  }

  int httpCode = http.GET();
  if (httpCode <= 0) {
    Serial.print("HTTP GET error: ");
    Serial.println(http.errorToString(httpCode));
    http.end();
    return false;
  }

  String payload = http.getString();
  http.end();

  if (httpCode != 200) {
    Serial.print("HTTP GET unexpected status: ");
    Serial.println(httpCode);
    Serial.println(payload);
    return false;
  }

  DeserializationError err = deserializeJson(doc, payload);
  if (err) {
    Serial.print("GET JSON parse failed: ");
    Serial.println(err.c_str());
    return false;
  }

  return true;
}

bool httpPostJson(const String& url, const String& body, DynamicJsonDocument& responseDoc) {
  HTTPClient http;
  WiFiClient plainClient;
  WiFiClientSecure secureClient;

  bool begun = false;
  if (isHttpsUrl(url)) {
    secureClient.setInsecure();
    begun = http.begin(secureClient, url);
  } else {
    begun = http.begin(plainClient, url);
  }

  if (!begun) {
    Serial.println("HTTP POST begin failed");
    return false;
  }

  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(body);
  String payload = http.getString();
  http.end();

  if (httpCode <= 0) {
    Serial.print("HTTP POST error: ");
    Serial.println(http.errorToString(httpCode));
    return false;
  }

  if (payload.length() > 0) {
    deserializeJson(responseDoc, payload);
  }

  if (httpCode < 200 || httpCode >= 300) {
    Serial.print("HTTP POST unexpected status: ");
    Serial.println(httpCode);
    Serial.println(payload);
    return false;
  }

  return true;
}

bool initFingerprintSensor() {
  fingerSerial.begin(57600, SERIAL_8N1, FP_RX_PIN, FP_TX_PIN);
  finger.begin(57600);
  delay(100);

  if (!finger.verifyPassword()) {
    Serial.println("Fingerprint sensor not found or wrong wiring.");
    return false;
  }

  if (finger.getTemplateCount() == FINGERPRINT_OK) {
    Serial.print("Templates in sensor: ");
    Serial.println(finger.templateCount);
  }

  Serial.println("Fingerprint sensor ready.");
  return true;
}

int findNextTemplateId() {
  if (finger.getTemplateCount() != FINGERPRINT_OK) {
    return 1;
  }

  int nextId = finger.templateCount + 1;
  if (nextId < 1) {
    nextId = 1;
  }
  return nextId;
}

bool postResult(const char* status, int templateId, const String& userId, const String& errorMessage) {
  String url = makeUrl("/api/device/esp/result?token=") + DEVICE_TOKEN;

  DynamicJsonDocument requestDoc(512);
  requestDoc["token"] = DEVICE_TOKEN;
  requestDoc["status"] = status;

  if (templateId > 0) {
    requestDoc["templateId"] = templateId;
  }
  if (userId.length() > 0) {
    requestDoc["userId"] = userId;
  }
  if (errorMessage.length() > 0) {
    requestDoc["error"] = errorMessage;
  }

  String body;
  serializeJson(requestDoc, body);

  DynamicJsonDocument responseDoc(1024);
  bool ok = httpPostJson(url, body, responseDoc);
  if (!ok) {
    Serial.println("Posting result failed");
    return false;
  }

  Serial.print("Posted result: ");
  Serial.println(status);
  return true;
}

bool waitForFingerPress(uint32_t timeoutMs) {
  unsigned long startedAt = millis();
  while (millis() - startedAt < timeoutMs) {
    uint8_t result = finger.getImage();
    if (result == FINGERPRINT_OK) {
      return true;
    }
    if (result != FINGERPRINT_NOFINGER) {
      delay(50);
    }
    delay(50);
  }
  return false;
}

bool waitForFingerRelease(uint32_t timeoutMs) {
  unsigned long startedAt = millis();
  while (millis() - startedAt < timeoutMs) {
    uint8_t result = finger.getImage();
    if (result == FINGERPRINT_NOFINGER) {
      return true;
    }
    delay(50);
  }
  return false;
}

bool captureTemplateSlot(uint8_t slotNumber) {
  uint8_t result = finger.image2Tz(slotNumber);
  if (result != FINGERPRINT_OK) {
    Serial.print("image2Tz failed on slot ");
    Serial.println(slotNumber);
    return false;
  }
  return true;
}

bool enrollFingerprint(const String& userId) {
  if (userId.length() == 0) {
    return postResult("enroll_error", 0, "", "Missing userId from server");
  }

  int templateId = findNextTemplateId();
  Serial.print("Enroll start. User: ");
  Serial.print(userId);
  Serial.print(" Template ID: ");
  Serial.println(templateId);

  Serial.println("Place finger for first scan...");
  if (!waitForFingerPress(30000)) {
    return postResult("enroll_error", 0, userId, "Timeout waiting for first finger scan");
  }
  if (!captureTemplateSlot(1)) {
    return postResult("enroll_error", 0, userId, "Failed to read first finger image");
  }

  Serial.println("Remove finger...");
  if (!waitForFingerRelease(15000)) {
    return postResult("enroll_error", 0, userId, "Finger was not removed in time");
  }

  Serial.println("Place same finger again...");
  if (!waitForFingerPress(30000)) {
    return postResult("enroll_error", 0, userId, "Timeout waiting for second finger scan");
  }
  if (!captureTemplateSlot(2)) {
    return postResult("enroll_error", 0, userId, "Failed to read second finger image");
  }

  if (finger.createModel() != FINGERPRINT_OK) {
    return postResult("enroll_error", 0, userId, "Fingerprints did not match");
  }

  if (finger.storeModel(templateId) != FINGERPRINT_OK) {
    return postResult("enroll_error", 0, userId, "Failed to save fingerprint in sensor memory");
  }

  Serial.println("Enroll success");
  return postResult("enroll_success", templateId, userId, "");
}

bool scanFingerprint() {
  Serial.println("Waiting for finger to scan...");

  unsigned long startedAt = millis();
  while (millis() - startedAt < 30000) {
    uint8_t result = finger.getImage();

    if (result == FINGERPRINT_NOFINGER) {
      delay(100);
      continue;
    }

    if (result != FINGERPRINT_OK) {
      return postResult("scan_notfound", 0, "", "");
    }

    if (finger.image2Tz() != FINGERPRINT_OK) {
      return postResult("scan_notfound", 0, "", "");
    }

    if (finger.fingerFastSearch() == FINGERPRINT_OK) {
      Serial.print("Matched template ID: ");
      Serial.println(finger.fingerID);
      return postResult("scan_success", finger.fingerID, "", "");
    }

    return postResult("scan_notfound", 0, "", "");
  }

  Serial.println("Scan timeout");
  return postResult("scan_notfound", 0, "", "");
}

void handleServerMode() {
  String url = makeUrl("/api/device/esp/mode?token=") + DEVICE_TOKEN;

  DynamicJsonDocument responseDoc(1024);
  bool ok = httpGetJson(url, responseDoc);
  if (!ok) {
    return;
  }

  bool success = responseDoc["success"] | false;
  if (!success) {
    Serial.println("Server returned unsuccessful mode response");
    return;
  }

  String mode = responseDoc["data"]["mode"] | "idle";
  String userId = responseDoc["data"]["userId"] | "";

  if (mode != lastMode) {
    Serial.print("Mode changed to: ");
    Serial.println(mode);
    lastMode = mode;
  }

  if (mode == "enroll") {
    enrollFingerprint(userId);
    lastMode = "idle";
    return;
  }

  if (mode == "scan") {
    scanFingerprint();
    lastMode = "idle";
    return;
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("Medi Track Doctor Scanner booting...");

  connectWifi();
  sensorReady = initFingerprintSensor();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWifi();
  }

  if (!sensorReady) {
    sensorReady = initFingerprintSensor();
    delay(2000);
    return;
  }

  unsigned long now = millis();
  if (now - lastPollAt >= POLL_INTERVAL_MS) {
    lastPollAt = now;
    handleServerMode();
  }

  delay(50);
}
