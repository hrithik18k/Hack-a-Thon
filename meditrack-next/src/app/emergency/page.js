"use client";

import { Protected } from "../../middleware/route";
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";

const Emergency = () => {
  const [status, setStatus]     = useState("idle");
  const [patient, setPatient]   = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const pollRef                 = useRef(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const handleScanClick = async () => {
    try {
      const { data } = await axios.get("/api/device/doctor/my-device", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!data.data || !data.data.isActive) {
        setStatus("error");
        setErrorMsg("No scanner registered. Go to Device Setup to register your ESP32.");
      } else {
        triggerScan();
      }
    } catch(err) {
      setStatus("error");
      setErrorMsg("Could not verify device status.");
    }
  };

  const triggerScan = async () => {
    setStatus("scanning");
    setPatient(null);
    setErrorMsg("");

    try {
      await axios.post(
        "/api/device/setmode",
        { mode: "scan" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      startPolling();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.response?.data?.message || "Could not reach server");
    }
  };

  const startPolling = () => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get("/api/device/result", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success && data.data?.status === "found") {
          setPatient(data.data);
          setStatus("found");
          stopPolling();
        } else if (data.data?.status === "not_found") {
          setStatus("not_found");
          stopPolling();
        }
      } catch (err) {
        // keep polling
      }
    }, 2000);

    // Timeout after 60s
    setTimeout(() => {
      if (pollRef.current) {
        stopPolling();
        setStatus("error");
        setErrorMsg("Scan timed out. No finger detected.");
      }
    }, 60000);
  };

  const reset = () => {
    stopPolling();
    setStatus("idle");
    setPatient(null);
    setErrorMsg("");
    axios.post("/api/device/setmode", { mode: "idle" }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
  };

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "N/A";

  return (
    <>
      <Navbar />

      <section className="emergency-page">
        <div className="emergency-header">
          <div className="emergency-badge">EMERGENCY MODE</div>
          <h1 className="auth-title">Biometric Patient Lookup</h1>
          <p className="auth-subtitle">Scan a patient's fingerprint to instantly retrieve their medical records.</p>
        </div>

        <div className="emergency-card">
          
          {/* Standing By */}
          {status === "idle" && (
            <div className="fp-state-content fp-card-in">
              <div className="fp-icon-container">
                <FingerprintIcon size={80} color="var(--fp-primary)" />
              </div>
              <p className="fp-status-text">Device is standing by</p>
              <button className="btn btn-primary" onClick={handleScanClick}>
                Get Patient Fingerprint
              </button>
            </div>
          )}

          {/* Scanning */}
          {status === "scanning" && (
            <div className="fp-state-content fp-card-in">
              <div className="fp-icon-container">
                <div className="fp-ring fp-ring-1" />
                <div className="fp-ring fp-ring-2" />
                <div className="fp-ring fp-ring-3" />
                <span className="fp-pulse">
                  <FingerprintIcon size={80} color="var(--fp-primary)" />
                </span>
              </div>
              <p className="fp-status-text fp-blink">Place patient's finger on scanner...</p>
              <button className="btn btn-secondary-outline" onClick={reset}>Cancel</button>
            </div>
          )}

          {/* Not Found / Error */}
          {(status === "not_found" || status === "error") && (
            <div className="fp-state-content fp-card-in">
              <div className="fp-icon-container">
                <FingerprintIcon size={80} color="var(--fp-danger)" />
              </div>
              <p className="fp-status-text" style={{ color: "var(--fp-danger)" }}>
                {status === "not_found" ? "No matching patient found" : errorMsg}
              </p>
              <button className="btn btn-primary" onClick={reset}>Try Again</button>
            </div>
          )}

          {/* Found Result */}
          {status === "found" && patient && (
            <div className="fp-card-in">
              <div className="patient-identity-strip">
                <img
                  src={patient.user?.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                  alt="patient"
                  className="patient-avatar-large"
                />
                <div style={{ flex: 1 }}>
                  <h2 className="auth-title" style={{ textAlign: "left", margin: 0 }}>
                    {patient.user?.firstname} {patient.user?.lastname}
                  </h2>
                  <p style={{ margin: 0, opacity: 0.7 }}>
                    {patient.user?.gender} • {patient.user?.city} • {fmtDate(patient.user?.dateOfBirth)}
                  </p>
                </div>
                <button className="btn btn-danger-outline btn-sm" onClick={reset}>Close</button>
              </div>

              <h3>Medical History ({patient.reports?.length || 0})</h3>
              <div className="reports-timeline">
                {patient.reports?.map((r) => (
                  <div key={r._id} className="report-card">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: 700, color: "var(--fp-primary)" }}>{fmtDate(r.appointmentDate)}</span>
                      <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{r.doctorName} • {r.hospitalName}</span>
                    </div>
                    <p><strong>Diagnosis:</strong> {r.diagnosis}</p>
                    {r.medications?.length > 0 && (
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                        {r.medications.map((m, mi) => (
                          <span key={mi} style={{ fontSize: "0.75rem", background: "rgba(59,130,246,0.1)", padding: "2px 8px", borderRadius: "4px" }}>
                            {m.name} ({m.dosage})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {!patient.reports?.length && <p>No records found for this patient.</p>}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

// Simple Icon
const FingerprintIcon = ({ color = "currentColor", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M2 12a10 10 0 0 1 18-6" /><path d="M2 17.5a14.5 14.5 0 0 0 4.24 5.5" /><path d="M6 10a8 8 0 0 1 14.7-2.4" /><path d="M6 14a6 6 0 0 1 11.94-1.5" /><path d="M6.18 17A14 14 0 0 0 7 22" />
  </svg>
);

const ProtectedEmergency = () => <Protected><Emergency /></Protected>;

export default ProtectedEmergency;
FingerprintIcon.propTypes = {
  color: PropTypes.any,
  size: PropTypes.any
};
