#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Fingerprint.h>

// ==========================================
// Basic test configuration
// ==========================================
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Set to false if you are testing without the OLED
const bool USE_OLED = false;

// ESP32 pin mapping
static const int FP_RX_PIN = 16;   // ESP32 RX2 <- sensor TX (yellow)
static const int FP_TX_PIN = 17;   // ESP32 TX2 -> sensor RX (green)
static const int OLED_SDA_PIN = 21;
static const int OLED_SCL_PIN = 22;

static const uint8_t SCREEN_WIDTH = 128;
static const uint8_t SCREEN_HEIGHT = 64;
static const uint8_t OLED_ADDR = 0x3C;

HardwareSerial fingerSerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&fingerSerial);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

unsigned long lastStatusPrintAt = 0;

void logLine(const char* text) {
  Serial.println(text);
}

void oledShow(const String& line1, const String& line2 = "", const String& line3 = "") {
  if (!USE_OLED) {
    return;
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println(line1);
  if (line2.length()) display.println(line2);
  if (line3.length()) display.println(line3);
  display.display();
}

bool testWiFi() {
  logLine("========================================");
  logLine("TEST 1: Wi-Fi");
  logLine("Connecting to Wi-Fi...");
  oledShow("TEST 1", "Wi-Fi", "Connecting...");

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long startedAt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startedAt < 20000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    logLine("[PASS] Wi-Fi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    oledShow("TEST 1 PASS", "Wi-Fi connected", WiFi.localIP().toString());
    return true;
  }

  logLine("[FAIL] Wi-Fi did not connect");
  oledShow("TEST 1 FAIL", "Wi-Fi failed");
  return false;
}

bool testOled() {
  logLine("========================================");
  logLine("TEST 2: OLED");

  if (!USE_OLED) {
    logLine("[SKIP] OLED disabled in code");
    return false;
  }

  Wire.begin(OLED_SDA_PIN, OLED_SCL_PIN);

  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    logLine("[FAIL] OLED not found at I2C address 0x3C");
    return false;
  }

  oledShow("TEST 2 PASS", "OLED working", "Address 0x3C");
  logLine("[PASS] OLED initialized");
  delay(1500);

  display.clearDisplay();
  display.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, SSD1306_WHITE);
  display.drawLine(0, 0, SCREEN_WIDTH - 1, SCREEN_HEIGHT - 1, SSD1306_WHITE);
  display.drawLine(SCREEN_WIDTH - 1, 0, 0, SCREEN_HEIGHT - 1, SSD1306_WHITE);
  display.display();
  logLine("[PASS] OLED drew test pattern");
  delay(1500);

  oledShow("OLED OK", "Look at screen");
  return true;
}

bool testFingerprintSensor() {
  logLine("========================================");
  logLine("TEST 3: Fingerprint sensor");
  logLine("Initializing sensor on UART2...");
  oledShow("TEST 3", "Fingerprint", "Init...");

  fingerSerial.begin(57600, SERIAL_8N1, FP_RX_PIN, FP_TX_PIN);
  finger.begin(57600);
  delay(200);

  if (!finger.verifyPassword()) {
    logLine("[FAIL] Fingerprint sensor not detected");
    logLine("Check wiring:");
    logLine("Red -> 3V3");
    logLine("Black -> GND");
    logLine("Yellow -> P16");
    logLine("Green -> P17");
    oledShow("TEST 3 FAIL", "Sensor not found");
    return false;
  }

  logLine("[PASS] Fingerprint sensor detected");

  uint8_t countStatus = finger.getTemplateCount();
  if (countStatus == FINGERPRINT_OK) {
    Serial.print("Templates stored in sensor: ");
    Serial.println(finger.templateCount);
  } else {
    logLine("[WARN] Could not read template count");
  }

  oledShow("TEST 3 PASS", "Sensor connected");
  return true;
}

void liveFingerprintReadTest() {
  logLine("========================================");
  logLine("LIVE TEST: Place finger on scanner");
  logLine("Open Serial Monitor at 115200 baud");
  logLine("You should see NO FINGER / IMAGE OK / MATCH STATUS logs");
  oledShow("LIVE TEST", "Place finger", "See Serial log");
}

void setup() {
  Serial.begin(115200);
  delay(1200);

  logLine("");
  logLine("========================================");
  logLine("Medi Track Hardware Tester");
  logLine("========================================");
  logLine("This sketch tests Wi-Fi, OLED, and fingerprint sensor.");
  logLine("Wiring for fingerprint:");
  logLine("Red -> 3V3");
  logLine("Black -> GND");
  logLine("Yellow -> P16");
  logLine("Green -> P17");

  if (USE_OLED) {
    logLine("Wiring for OLED:");
    logLine("GND -> GND");
    logLine("VCC -> 3V3");
    logLine("SCL -> P22");
    logLine("SDA -> P21");
  } else {
    logLine("OLED test is disabled in code");
  }

  testOled();
  testWiFi();
  bool fingerprintOk = testFingerprintSensor();

  if (fingerprintOk) {
    liveFingerprintReadTest();
  } else {
    logLine("Skipping live fingerprint read test because init failed.");
  }
}

void loop() {
  if (millis() - lastStatusPrintAt < 500) {
    return;
  }
  lastStatusPrintAt = millis();

  uint8_t imageResult = finger.getImage();

  if (imageResult == FINGERPRINT_NOFINGER) {
    logLine("Sensor status: NO FINGER");
    return;
  }

  if (imageResult == FINGERPRINT_OK) {
    logLine("Sensor status: IMAGE OK");

    uint8_t convertResult = finger.image2Tz();
    if (convertResult == FINGERPRINT_OK) {
      logLine("Sensor status: TEMPLATE CONVERSION OK");

      uint8_t searchResult = finger.fingerFastSearch();
      if (searchResult == FINGERPRINT_OK) {
        Serial.print("MATCH FOUND. Template ID: ");
        Serial.println(finger.fingerID);
        Serial.print("Confidence: ");
        Serial.println(finger.confidence);
        oledShow("MATCH FOUND", "ID: " + String(finger.fingerID), "Conf: " + String(finger.confidence));
      } else {
        logLine("No stored match found. Sensor is still reading correctly.");
        oledShow("Finger read OK", "No stored match");
      }
    } else {
      Serial.print("Template conversion failed. Code: ");
      Serial.println(convertResult);
    }

    delay(1500);
    return;
  }

  Serial.print("Sensor read error. Code: ");
  Serial.println(imageResult);
}
