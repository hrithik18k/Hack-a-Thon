import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import jwtDecode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Pharmacy = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dispensingId, setDispensingId] = useState(null);
  const [pharmacy, setPharmacy] = useState("");

  const token = localStorage.getItem("token");

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/prescription/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleDispense = async (rx) => {
    if (!pharmacy.trim()) {
      toast.error("Enter pharmacy name before dispensing");
      return;
    }
    setDispensingId(rx._id);
    try {
      await axios.put(
        "/api/prescription/dispense",
        { prescriptionId: rx.prescriptionId, dispensedPharmacy: pharmacy },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Prescription ${rx.prescriptionId} dispensed successfully`);
      fetchPrescriptions();
    } catch (err) {
      toast.error("Failed to dispense prescription");
    } finally {
      setDispensingId(null);
    }
  };

  const statusStyle = (status) => {
    const map = {
      Active: { background: "#d4edda", color: "#155724" },
      Dispensed: { background: "#cce5ff", color: "#004085" },
      Expired: { background: "#e2e3e5", color: "#383d41" },
      Cancelled: { background: "#f8d7da", color: "#721c24" },
    };
    return { padding: ".25rem .65rem", borderRadius: 12, fontSize: ".78rem", fontWeight: 600, ...(map[status] || {}) };
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#1a1a2e", marginBottom: "1rem" }}>
          Integrated Pharmacy Module
        </h2>
        <p style={{ color: "#555", marginBottom: "1.5rem" }}>
          Fingerprint-authenticated prescription dispensing. All dispensing updates patient records automatically.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <label style={{ fontWeight: 600, color: "#444" }}>Pharmacy Name:</label>
          <input
            value={pharmacy}
            onChange={(e) => setPharmacy(e.target.value)}
            placeholder="Enter current pharmacy name"
            style={{ padding: ".5rem .8rem", border: "1px solid #ddd", borderRadius: 6, fontSize: ".9rem", minWidth: 220 }}
          />
        </div>
        {loading ? (
          <p>Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", padding: "2rem" }}>No active prescriptions found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.08)" }}>
              <thead>
                <tr>
                  {["Rx ID", "Patient", "Doctor", "Medications", "Allergy Alerts", "Status", "Auth", "Action"].map((h) => (
                    <th key={h} style={{ background: "#667eea", color: "white", padding: ".8rem 1rem", textAlign: "left", fontSize: ".85rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((rx) => (
                  <tr key={rx._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: ".75rem 1rem", fontWeight: 600, color: "#667eea" }}>{rx.prescriptionId}</td>
                    <td style={{ padding: ".75rem 1rem" }}>{rx.patientName}</td>
                    <td style={{ padding: ".75rem 1rem" }}>{rx.doctorName}</td>
                    <td style={{ padding: ".75rem 1rem" }}>
                      {rx.medications && rx.medications.map((m, i) => (
                        <div key={i} style={{ fontSize: ".82rem", marginBottom: ".2rem" }}>
                          <strong>{m.name}</strong>{m.dosage ? ` — ${m.dosage}` : ""}
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: ".75rem 1rem" }}>
                      {rx.allergies && rx.allergies.length > 0 ? (
                        rx.allergies.map((a, i) => (
                          <span key={i} style={{ display: "inline-block", background: "#f8d7da", color: "#721c24", padding: ".2rem .5rem", borderRadius: 12, fontSize: ".78rem", margin: ".1rem" }}>
                            ⚠ {a}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: "#28a745", fontSize: ".85rem" }}>None</span>
                      )}
                    </td>
                    <td style={{ padding: ".75rem 1rem" }}>
                      <span style={statusStyle(rx.status)}>{rx.status}</span>
                    </td>
                    <td style={{ padding: ".75rem 1rem" }}>
                      {rx.patientAuthorized ? (
                        <span style={{ color: "#28a745", fontWeight: 600, fontSize: ".85rem" }}>✓ Authorized</span>
                      ) : (
                        <span style={{ color: "#dc3545", fontSize: ".85rem" }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: ".75rem 1rem" }}>
                      {rx.status === "Active" ? (
                        <button
                          onClick={() => handleDispense(rx)}
                          disabled={dispensingId === rx._id}
                          style={{ background: "#667eea", color: "white", border: "none", padding: ".4rem .9rem", borderRadius: 6, cursor: "pointer", fontSize: ".82rem", fontWeight: 600 }}
                        >
                          {dispensingId === rx._id ? "Dispensing..." : "1-Click Dispense"}
                        </button>
                      ) : (
                        <span style={{ color: "#888", fontSize: ".82rem" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Pharmacy;
