"use client";

import { DoctorOnly } from "../../middleware/route";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import EditorialShell from "../../components/editorial/EditorialShell";

const DeviceSetup = () => {
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deviceName, setDeviceName] = useState("");
  const [newToken, setNewToken] = useState("");

  const fetchDeviceStatus = async () => {
    try {
      const { data } = await axios.get("/api/device/doctor/my-device");
      if (data.success && data.data) {
        setDevice(data.data);
      } else {
        setDevice(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceStatus();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!deviceName.trim()) return toast.error("Device Name is required");
    try {
      const { data } = await axios.post(
        "/api/device/doctor/register",
        { deviceName }
      );
      if (data.success) {
        setNewToken(data.data.deviceToken);
        toast.success("Device registered successfully");
        setDeviceName("");
        fetchDeviceStatus();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  const handleUnregister = async () => {
    if (!window.confirm("Are you sure you want to unregister this device? It will stop working immediately.")) return;
    try {
      const { data } = await axios.delete("/api/device/doctor/unregister");
      if (data.success) {
        toast.success("Device unregistered");
        setDevice(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unregistration failed");
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(newToken);
    toast.success("Copied to clipboard!");
  };

  return (
    <EditorialShell>
      <main className="editorial-page">
        <section className="editorial-page-hero">
          <div className="editorial-shell">
            <span className="editorial-eyebrow">Hardware pairing</span>
            <h1 className="editorial-page-title">Pair and manage the ESP32 fingerprint reader from the redesigned console.</h1>
            <p className="editorial-lede">The registration flow still uses the live backend endpoints for token generation and device status.</p>
          </div>
        </section>

        <section className="editorial-section editorial-section-tight">
          <div className="editorial-shell editorial-narrow-shell">
            <div className="editorial-stack">
            {/* Status Card */}
            <div className="editorial-detail-panel">
              <h3 className="editorial-card-title">Current Device Status</h3>
              {loading ? (
                <p>Loading...</p>
              ) : device?.isActive ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{ padding: "0.5rem 1rem", borderRadius: "5px", background: "rgba(0,255,0,0.1)", color: "var(--fp-success)", fontWeight: "bold" }}>
                      Active
                    </div>
                    <strong>{device.deviceName}</strong>
                  </div>
                  <p><strong>Current Mode:</strong> {device.currentMode}</p>
                  <p><strong>Last Seen:</strong> {device.lastSeen ? new Date(device.lastSeen).toLocaleString() : "Never"}</p>
                  
                  <button className="editorial-btn editorial-btn-danger" onClick={handleUnregister} style={{ marginTop: "1rem" }}>
                    Unregister Device
                  </button>
                </div>
              ) : (
                <div style={{ padding: "1rem", background: "rgba(255,0,0,0.05)", borderRadius: "8px", color: "var(--fp-danger)" }}>
                  <p>No device registered. Please register a device to enable fingerprint scanning.</p>
                </div>
              )}
            </div>

            {/* Registration Form */}
            <div className="editorial-detail-panel">
              <h3 className="editorial-card-title">{device?.isActive ? "Re-register Device" : "Register New Device"}</h3>
              {device?.isActive && (
                <p style={{ fontSize: "0.9rem", color: "gray" }}>Warning: Re-registering will generate a new token and invalidate your current hardware setup.</p>
              )}
              <form onSubmit={handleRegister} style={{ marginTop: "1rem" }}>
                <div className="form-group">
                  <label className="editorial-label">Device Name</label>
                  <input
                    type="text"
                    className="editorial-input"
                    placeholder="e.g. Exam Room 1 Scanner"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                  />
                </div>
                <button type="submit" className="editorial-btn editorial-btn-primary">
                  {device?.isActive ? "Re-register Device" : "Register Device"}
                </button>
              </form>

              {newToken && (
                <div style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: "8px", background: "rgba(255, 152, 0, 0.1)", border: "1px solid var(--fp-warning)" }}>
                  <h4 style={{ color: "var(--fp-warning)", marginBottom: "0.5rem" }}>⚠️ Important: Save Your Token</h4>
                  <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
                    This token is only shown once. You must enter this into your ESP32 firmare configuration.
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <code style={{ flex: 1, padding: "0.5rem", background: "#f4f4f4", borderRadius: "4px", overflowWrap: "break-word", userSelect: "all" }}>
                      {newToken}
                    </code>
                    <button className="editorial-btn editorial-btn-outline" onClick={copyToken}>Copy</button>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="editorial-detail-panel">
              <h3 className="editorial-card-title">ESP32 Setup Instructions</h3>
              <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8" }}>
                <li>Compile and flash the provided ESP32 firmware code via Arduino IDE.</li>
                <li>In your code, set the <code>WIFI_SSID</code> and <code>WIFI_PASSWORD</code>.</li>
                <li>Replace the placeholder token with your newly generated <strong>Device Token</strong>.</li>
                <li>Power on the ESP32. It will automatically connect and pull modes every 3 seconds.</li>
                <li>When its &apos;Last Seen&apos; value updates here, the device is online and ready!</li>
              </ul>
            </div>
          </div>
          </div>
        </section>
      </main>
    </EditorialShell>
  );
};

const DoctorDeviceSetup = () => <DoctorOnly><DeviceSetup /></DoctorOnly>;

export default DoctorDeviceSetup;
