import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jwtDecode from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaClock, FaHospital } from "react-icons/fa";
import "../styles/accesslogs.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AccessLogs = () => {
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  let decoded = {};
  let role = "";
  try {
    if (token) { decoded = jwtDecode(token); role = decoded.role || ""; }
  } catch (e) {}

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [facility, setFacility] = useState("");
  const [purpose, setPurpose] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const endpoint = role === "Patient" ? "/api/accesslog/mine" : "/api/accesslog/requests";
      const { data } = await axios.get(endpoint, authHeader);
      setLogs(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      toast.error("Failed to load access logs.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleApprove = async (logId) => {
    try {
      await axios.put("/api/accesslog/approve", { logId, authMethod: "OTP" }, authHeader);
      toast.success("Request approved."); fetchLogs();
    } catch (err) { toast.error("Failed to approve request."); }
  };

  const handleDeny = async (logId) => {
    try {
      await axios.put("/api/accesslog/deny", { logId }, authHeader);
      toast.success("Request denied."); fetchLogs();
    } catch (err) { toast.error("Failed to deny request."); }
  };

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    if (!patientId.trim() || !facility.trim() || !purpose.trim()) {
      toast.error("Please fill in all fields."); return;
    }
    try {
      await axios.post("/api/accesslog/request", {
        patientId, facility, purpose,
        requesterName: decoded.name || decoded.firstname || "",
        requesterRole: role,
      }, authHeader);
      toast.success("Access request submitted.");
      setPatientId(""); setFacility(""); setPurpose(""); fetchLogs();
    } catch (err) { toast.error("Failed to submit access request."); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString() : "N/A";

  const statusBadge = (status) => {
    const cls = status === "Approved" ? "badge-green" : status === "Denied" ? "badge-red" : "badge-yellow";
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  if (role === "Patient") {
    const total = logs.length;
    const pending = logs.filter((l) => l.status === "Pending").length;
    const approved = logs.filter((l) => l.status === "Approved").length;
    const denied = logs.filter((l) => l.status === "Denied").length;

    return (
      <>
        <Navbar />
        <div className="access-logs-container">
          <div className="access-header"><h2><FaShieldAlt /> Access Logs</h2></div>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="count">{total}</div>
              <div className="label">Total Requests</div>
            </div>
            <div className="stat-card">
              <div className="count" style={{ color: "#f39c12" }}>{pending}</div>
              <div className="label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="count" style={{ color: "#27ae60" }}>{approved}</div>
              <div className="label">Approved</div>
            </div>
            <div className="stat-card">
              <div className="count" style={{ color: "#e74c3c" }}>{denied}</div>
              <div className="label">Denied</div>
            </div>
          </div>

          {loading ? <p>Loading...</p> : (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Requester Name</th><th>Role</th><th>Facility</th>
                    <th>Purpose</th><th>Status</th><th>Requested At</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? logs.map((log) => (
                    <tr key={log._id}>
                      <td>{log.requesterName || "N/A"}</td>
                      <td>{log.requesterRole || "N/A"}</td>
                      <td>{log.facility || "N/A"}</td>
                      <td>{log.purpose || "N/A"}</td>
                      <td>{statusBadge(log.status)}</td>
                      <td>{formatDate(log.createdAt)}</td>
                      <td>
                        {log.status === "Pending" && (
                          <>
                            <button className="btn-approve" onClick={() => handleApprove(log._id)}>
                              <FaCheckCircle /> Approve (OTP)
                            </button>
                            <button className="btn-deny" onClick={() => handleDeny(log._id)}>
                              <FaTimesCircle /> Deny
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7} style={{ textAlign: "center", color: "#999" }}>No access requests.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="access-logs-container">
        <div className="access-header"><h2><FaShieldAlt /> Access Requests</h2></div>

        <div className="request-form">
          <h3>Request Access to Patient Record</h3>
          <form onSubmit={handleRequestAccess}>
            <div className="form-row">
              <input type="text" placeholder="Patient ID" value={patientId}
                onChange={(e) => setPatientId(e.target.value)} />
              <input type="text" placeholder="Facility / Hospital" value={facility}
                onChange={(e) => setFacility(e.target.value)} />
              <textarea placeholder="Purpose of access" value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={2} style={{ resize: "none" }} />
              <button type="submit" className="btn-primary"><FaHospital /> Request Access</button>
            </div>
          </form>
        </div>

        {loading ? <p>Loading...</p> : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th><th>Facility</th>
                  <th>Purpose</th><th>Status</th><th>Requested At</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? logs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      {log.patientId && log.patientId.firstname
                        ? `${log.patientId.firstname} ${log.patientId.lastname || ""}`
                        : "Patient"}
                    </td>
                    <td>{log.facility || "N/A"}</td>
                    <td>{log.purpose || "N/A"}</td>
                    <td>{statusBadge(log.status)}</td>
                    <td>{formatDate(log.createdAt)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "#999" }}>No access requests yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AccessLogs;
