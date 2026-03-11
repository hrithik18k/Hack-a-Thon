import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import jwtDecode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const SmartDispenser = () => {
  const [dispenser, setDispenser] = useState(null);
  const [allDispensers, setAllDispensers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : {};
  const isAdmin = user.role === "Admin";

  const fetchData = async () => {
    try {
      setLoading(true);
      if (isAdmin) {
        const { data } = await axios.get("/api/dispenser/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllDispensers(Array.isArray(data.data) ? data.data : []);
      } else {
        const { data } = await axios.get("/api/dispenser/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDispenser(data.data);
      }
    } catch (err) {
      // Patient with no dispenser assigned yet
      setDispenser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTriggerDose = async (deviceId, compartmentLabel) => {
    try {
      await axios.put(
        "/api/dispenser/trigger",
        { deviceId, compartmentLabel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Compartment ${compartmentLabel} unlocked`);
      fetchData();
    } catch (err) {
      toast.error("Failed to trigger dose");
    }
  };

  const handleReset = async (deviceId, compartmentLabel) => {
    try {
      await axios.put(
        "/api/dispenser/reset",
        { deviceId, compartmentLabel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Compartment ${compartmentLabel} reset to Locked`);
      fetchData();
    } catch (err) {
      toast.error("Failed to reset compartment");
    }
  };

  const compartmentStatusStyle = (status) => {
    const map = {
      Locked: { background: "#f8d7da", color: "#721c24" },
      Unlocked: { background: "#fff3cd", color: "#856404" },
      Dispensed: { background: "#d4edda", color: "#155724" },
    };
    return { padding: ".2rem .55rem", borderRadius: 10, fontSize: ".78rem", fontWeight: 600, ...(map[status] || {}) };
  };

  const DispenserCard = ({ d }) => (
    <div style={{ background: "white", borderRadius: 10, padding: "1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,.08)", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: ".5rem" }}>
        <div>
          <h3 style={{ margin: 0, color: "#1a1a2e" }}>{d.deviceId}</h3>
          <p style={{ margin: ".2rem 0 0", color: "#666", fontSize: ".9rem" }}>Patient: <strong>{d.patientName}</strong></p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ padding: ".3rem .8rem", borderRadius: 20, fontSize: ".82rem", fontWeight: 600, background: d.connectionStatus === "Online" ? "#d4edda" : "#f8d7da", color: d.connectionStatus === "Online" ? "#155724" : "#721c24" }}>
            {d.connectionStatus === "Online" ? "● Online" : "● Offline"}
          </span>
          {d.missedDoses > 0 && (
            <span style={{ background: "#f8d7da", color: "#721c24", padding: ".3rem .8rem", borderRadius: 20, fontSize: ".82rem", fontWeight: 600 }}>
              ⚠ {d.missedDoses} Missed Dose{d.missedDoses > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Compartment", "Medication", "Dosage", "Schedule", "Status", "Actions"].map((h) => (
                <th key={h} style={{ background: "#f0f4ff", color: "#444", padding: ".6rem .8rem", textAlign: "left", fontSize: ".82rem", borderBottom: "2px solid #e0e7ff" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.compartments && d.compartments.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: ".6rem .8rem", fontWeight: 600 }}>{c.label}</td>
                <td style={{ padding: ".6rem .8rem" }}>{c.medication || "—"}</td>
                <td style={{ padding: ".6rem .8rem" }}>{c.dosage || "—"}</td>
                <td style={{ padding: ".6rem .8rem" }}>{c.scheduleTime || "—"}</td>
                <td style={{ padding: ".6rem .8rem" }}>
                  <span style={compartmentStatusStyle(c.status)}>{c.status}</span>
                </td>
                <td style={{ padding: ".6rem .8rem" }}>
                  {isAdmin && (
                    <>
                      {c.status !== "Dispensed" && (
                        <button onClick={() => handleTriggerDose(d.deviceId, c.label)} style={{ background: "#28a745", color: "white", border: "none", padding: ".3rem .7rem", borderRadius: 5, cursor: "pointer", fontSize: ".78rem", marginRight: ".3rem" }}>
                          Trigger
                        </button>
                      )}
                      {c.status === "Dispensed" && (
                        <button onClick={() => handleReset(d.deviceId, c.label)} style={{ background: "#6c757d", color: "white", border: "none", padding: ".3rem .7rem", borderRadius: 5, cursor: "pointer", fontSize: ".78rem" }}>
                          Reset
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {d.familyAlertPhone && (
        <p style={{ margin: "1rem 0 0", fontSize: ".85rem", color: "#666" }}>
          Family Alert: <strong>{d.familyAlertPhone}</strong>
          {d.familyAlertEmail && ` / ${d.familyAlertEmail}`}
        </p>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "2rem auto", padding: "0 1rem" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#1a1a2e", marginBottom: ".5rem" }}>
          Smart Medicine Dispenser (IoT)
        </h2>
        <p style={{ color: "#555", marginBottom: "2rem" }}>
          Arduino-controlled compartmentalized boxes with servo motor locks. LCD displays, buzzers, and LEDs provide medication guidance.
        </p>

        {loading ? (
          <p>Loading dispenser data...</p>
        ) : isAdmin ? (
          allDispensers.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>No dispensers registered yet.</p>
          ) : (
            allDispensers.map((d) => <DispenserCard key={d._id} d={d} />)
          )
        ) : dispenser ? (
          <DispenserCard d={dispenser} />
        ) : (
          <div style={{ textAlign: "center", padding: "3rem", background: "#f9f9f9", borderRadius: 10 }}>
            <p style={{ color: "#888", fontSize: "1.1rem" }}>No smart dispenser assigned to your account yet.</p>
            <p style={{ color: "#aaa", fontSize: ".9rem" }}>Contact your healthcare provider to set up a dispenser.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SmartDispenser;
