"use client";

import { Protected } from "../../middleware/route";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import EditorialShell from "../../components/editorial/EditorialShell";

axios.defaults.baseURL = getApiBaseUrl();

const Emergency = () => {
  const [status, setStatus] = useState("idle");
  const [patient, setPatient] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const pollRef = useRef(null);

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
      const { data } = await axios.get("/api/device/doctor/my-device");
      if (!data.data || !data.data.isActive) {
        setStatus("error");
        setErrorMsg("No scanner registered. Go to Device Setup to register your ESP32.");
      } else {
        triggerScan();
      }
    } catch {
      setStatus("error");
      setErrorMsg("Could not verify device status.");
    }
  };

  const triggerScan = async () => {
    setStatus("scanning");
    setPatient(null);
    setErrorMsg("");

    try {
      await axios.post("/api/device/setmode", { mode: "scan" });
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
        const { data } = await axios.get("/api/device/result");

        if (data.success && data.data?.status === "found") {
          setPatient(data.data);
          setStatus("found");
          stopPolling();
        } else if (data.data?.status === "not_found") {
          setStatus("not_found");
          stopPolling();
        }
      } catch {
        // keep polling
      }
    }, 2000);

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
    axios.post("/api/device/setmode", { mode: "idle" }).catch(() => {});
  };

  const fmtDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "N/A";

  const emergencyContact = patient?.user?.emergencyContact || {};

  return (
    <EditorialShell>
      <main className="editorial-page">
        <section className="editorial-page-hero">
          <div className="editorial-shell">
            <span className="editorial-eyebrow">Clinician emergency console</span>
            <h1 className="editorial-page-title">Biometric patient lookup tied to the real device workflow.</h1>
            <p className="editorial-lede">
              This screen now matches the redesign while still polling the actual device APIs already present in the project.
            </p>
          </div>
        </section>

        <section className="editorial-section editorial-section-tight">
          <div className="editorial-shell">
            <div className="editorial-emergency-card">
              {status === "idle" && (
                <div className="fp-state-content fp-card-in editorial-centered-state">
                  <div className="fp-icon-container">
                    <FingerprintIcon size={80} color="var(--fp-primary)" />
                  </div>
                  <p className="fp-status-text">Device is standing by</p>
                  <button className="editorial-btn editorial-btn-primary" onClick={handleScanClick}>
                    Get Patient Fingerprint
                  </button>
                </div>
              )}

              {status === "scanning" && (
                <div className="fp-state-content fp-card-in editorial-centered-state">
                  <div className="fp-icon-container">
                    <div className="fp-ring fp-ring-1" />
                    <div className="fp-ring fp-ring-2" />
                    <div className="fp-ring fp-ring-3" />
                    <span className="fp-pulse">
                      <FingerprintIcon size={80} color="var(--fp-primary)" />
                    </span>
                  </div>
                  <p className="fp-status-text fp-blink">Place patient&apos;s finger on scanner...</p>
                  <button className="editorial-btn editorial-btn-outline" onClick={reset}>Cancel</button>
                </div>
              )}

              {(status === "not_found" || status === "error") && (
                <div className="fp-state-content fp-card-in editorial-centered-state">
                  <div className="fp-icon-container">
                    <FingerprintIcon size={80} color="var(--fp-danger)" />
                  </div>
                  <p className="fp-status-text" style={{ color: "var(--fp-danger)" }}>
                    {status === "not_found" ? "No matching patient found" : errorMsg}
                  </p>
                  <button className="editorial-btn editorial-btn-primary" onClick={reset}>Try Again</button>
                </div>
              )}

              {status === "found" && patient && (
                <div className="fp-card-in">
                  <div className="patient-identity-strip editorial-patient-strip">
                    <img
                      src={patient.user?.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                      alt="patient"
                      className="patient-avatar-large"
                    />
                    <div style={{ flex: 1 }}>
                      <h2 className="editorial-card-title" style={{ margin: 0 }}>
                        {patient.user?.firstname} {patient.user?.lastname}
                      </h2>
                      <p style={{ margin: 0, opacity: 0.7 }}>
                        {patient.user?.gender} · {patient.user?.city} · {fmtDate(patient.user?.dateOfBirth)}
                      </p>
                    </div>
                    <button className="editorial-btn editorial-btn-outline" onClick={reset}>Close</button>
                  </div>

                  <h3 className="editorial-card-title" style={{ marginTop: "1.5rem" }}>
                    Medical History ({patient.reports?.length || 0})
                  </h3>
                  <div className="editorial-detail-panel" style={{ marginBottom: "1rem", marginTop: "1rem" }}>
                    <p><strong>Blood Group:</strong> {patient.user?.bloodGroup || "N/A"}</p>
                    <p><strong>Phone:</strong> {patient.user?.phone || "N/A"}</p>
                    <p><strong>Address:</strong> {patient.user?.address || patient.user?.temporaryAddress || patient.user?.permanentAddress || "N/A"}</p>
                    <p><strong>Emergency Contact:</strong> {emergencyContact.name || "N/A"} {emergencyContact.relation ? `(${emergencyContact.relation})` : ""}</p>
                    <p><strong>Emergency Phones:</strong> {emergencyContact.phone1 || emergencyContact.phone2 ? [emergencyContact.phone1, emergencyContact.phone2].filter(Boolean).join(", ") : "N/A"}</p>
                  </div>
                  <div className="reports-timeline">
                    {patient.reports?.map((report) => (
                      <div key={report._id} className="editorial-detail-panel">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", gap: "1rem", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, color: "var(--fp-primary)" }}>{fmtDate(report.appointmentDate)}</span>
                          <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{report.doctorName} · {report.hospitalName}</span>
                        </div>
                        <p><strong>Diagnosis:</strong> {report.diagnosis}</p>
                        {report.medications?.length > 0 && (
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                            {report.medications.map((medication, index) => (
                              <span key={index} style={{ fontSize: "0.75rem", background: "rgba(59,130,246,0.1)", padding: "2px 8px", borderRadius: "4px" }}>
                                {medication.name} ({medication.dosage})
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
          </div>
        </section>
      </main>
    </EditorialShell>
  );
};

const FingerprintIcon = ({ color = "currentColor", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
    <path d="M2 12a10 10 0 0 1 18-6" />
    <path d="M2 17.5a14.5 14.5 0 0 0 4.24 5.5" />
    <path d="M6 10a8 8 0 0 1 14.7-2.4" />
    <path d="M6 14a6 6 0 0 1 11.94-1.5" />
    <path d="M6.18 17A14 14 0 0 0 7 22" />
  </svg>
);

const ProtectedEmergency = () => (
  <Protected>
    <Emergency />
  </Protected>
);

export default ProtectedEmergency;

FingerprintIcon.propTypes = {
  color: PropTypes.any,
  size: PropTypes.any,
};
