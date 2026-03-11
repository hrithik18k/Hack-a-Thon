import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaPills,
  FaTimes,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaFileMedical,
} from "react-icons/fa";
import jwtDecode from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Prescriptions = () => {
  // Decode token
  const token = localStorage.getItem("token");
  let userId = null;
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
      role = decoded.role;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    diagnosis: "",
    medications: [],
  });
  const [medLine, setMedLine] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
  });
  const [expandedRows, setExpandedRows] = useState({});

  // Fetch prescriptions
  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const endpoint =
        role === "Doctor"
          ? `${process.env.REACT_APP_SERVER_DOMAIN}/api/prescription/doctor`
          : `${process.env.REACT_APP_SERVER_DOMAIN}/api/prescription/mine`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      toast.error("Failed to fetch prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (role) {
      fetchPrescriptions();
    }

    // Check for query params to pre-fill form
    const queryParams = new URLSearchParams(location.search);
    const pId = queryParams.get("patientId");
    const pName = queryParams.get("patientName");
    if (pId && pName) {
      setForm((prev) => ({
        ...prev,
        patientId: pId,
        patientName: pName,
      }));
      setShowForm(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, role]);

  // Handlers
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedLineChange = (e) => {
    setMedLine({ ...medLine, [e.target.name]: e.target.value });
  };

  const addMedication = () => {
    if (!medLine.name.trim() || !medLine.dosage.trim()) {
      toast.error("Drug name and dosage are required.");
      return;
    }
    setForm({ ...form, medications: [...form.medications, { ...medLine }] });
    setMedLine({ name: "", dosage: "", frequency: "", duration: "", notes: "" });
  };

  const removeMedication = (index) => {
    const updated = form.medications.filter((_, i) => i !== index);
    setForm({ ...form, medications: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId.trim() || !form.patientName.trim()) {
      toast.error("Patient ID and Patient Name are required.");
      return;
    }
    if (form.medications.length === 0) {
      toast.error("Please add at least one medication.");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/prescription/create`,
        { ...form, doctorId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Prescription created successfully!");
      setForm({ patientId: "", patientName: "", diagnosis: "", medications: [] });
      setMedLine({ name: "", dosage: "", frequency: "", duration: "", notes: "" });
      setShowForm(false);
      fetchPrescriptions();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create prescription."
      );
    }
  };

  const handleAuthorize = async (prescriptionId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/prescription/authorize`,
        { prescriptionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Prescription authorized successfully!");
      fetchPrescriptions();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to authorize prescription."
      );
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Status badge helper
  const getStatusBadgeStyle = (status) => {
    const base = {
      padding: "4px 12px",
      borderRadius: "20px",
      color: "#fff",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-block",
      letterSpacing: "0.3px",
    };
    switch (status) {
      case "Active":    return { ...base, backgroundColor: "#28a745" };
      case "Dispensed": return { ...base, backgroundColor: "#007bff" };
      case "Expired":   return { ...base, backgroundColor: "#6c757d" };
      case "Cancelled": return { ...base, backgroundColor: "#dc3545" };
      default:          return { ...base, backgroundColor: "#6c757d" };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const shortId = (id) => (id ? "#" + id.slice(-8).toUpperCase() : "-");

  // Inline styles
  const S = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f0f2f5",
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    },
    container: {
      flex: 1,
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "32px 20px",
      width: "100%",
      boxSizing: "border-box",
    },
    pageHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "28px",
    },
    pageTitle: {
      fontSize: "26px",
      fontWeight: "700",
      color: "#1a202c",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "28px",
      marginBottom: "28px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
    },
    cardTitle: {
      fontSize: "17px",
      fontWeight: "700",
      color: "#1a202c",
      marginTop: 0,
      marginBottom: "20px",
      paddingBottom: "12px",
      borderBottom: "1px solid #e8ecf0",
    },
    btn: {
      padding: "10px 18px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      lineHeight: 1,
    },
    btnPrimary:   { backgroundColor: "#4361ee", color: "#fff" },
    btnSuccess:   { backgroundColor: "#28a745", color: "#fff" },
    btnDanger:    { backgroundColor: "#dc3545", color: "#fff" },
    btnSecondary: { backgroundColor: "#6c757d", color: "#fff" },
    btnInfo:      { backgroundColor: "#17a2b8", color: "#fff" },
    btnSm:        { padding: "6px 12px", fontSize: "13px" },
    formRow2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "18px",
    },
    formGroup: { marginBottom: "18px" },
    label: {
      display: "block",
      marginBottom: "6px",
      fontWeight: "600",
      fontSize: "13px",
      color: "#495057",
    },
    input: {
      width: "100%",
      padding: "10px 13px",
      border: "1px solid #ced4da",
      borderRadius: "7px",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
      backgroundColor: "#fafbfc",
      color: "#212529",
    },
    textarea: {
      width: "100%",
      padding: "10px 13px",
      border: "1px solid #ced4da",
      borderRadius: "7px",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
      minHeight: "90px",
      resize: "vertical",
      backgroundColor: "#fafbfc",
      color: "#212529",
      fontFamily: "inherit",
    },
    medSection: {
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "18px",
      marginBottom: "20px",
      backgroundColor: "#f8fafc",
    },
    medSectionTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#343a40",
      marginBottom: "14px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    medGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1.5fr",
      gap: "10px",
      marginBottom: "12px",
    },
    medList: { listStyle: "none", padding: 0, margin: "14px 0 0 0" },
    medItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#fff",
      border: "1px solid #dee2e6",
      borderRadius: "7px",
      padding: "9px 13px",
      marginBottom: "7px",
    },
    medItemLeft: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "13px",
      color: "#495057",
      flexWrap: "wrap",
    },
    removeBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#dc3545",
      display: "flex",
      alignItems: "center",
      padding: "2px",
      flexShrink: 0,
    },
    formActions: {
      display: "flex",
      gap: "10px",
      justifyContent: "flex-end",
      marginTop: "4px",
    },
    tableWrapper: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
    th: {
      backgroundColor: "#f8f9fa",
      padding: "13px 15px",
      textAlign: "left",
      fontWeight: "700",
      fontSize: "13px",
      color: "#495057",
      borderBottom: "2px solid #dee2e6",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "13px 15px",
      borderBottom: "1px solid #f0f2f5",
      color: "#343a40",
      verticalAlign: "middle",
    },
    tdAlt: {
      padding: "13px 15px",
      borderBottom: "1px solid #f0f2f5",
      color: "#343a40",
      verticalAlign: "middle",
      backgroundColor: "#fafbfc",
    },
    expandedTd: {
      padding: "0",
      borderBottom: "2px solid rgba(67,97,238,0.13)",
    },
    expandedInner: { padding: "20px 22px", backgroundColor: "#f0f8ff" },
    medDetailGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      marginTop: "10px",
    },
    medDetailCard: {
      backgroundColor: "#fff",
      border: "1px solid #b8daff",
      borderRadius: "9px",
      padding: "12px 16px",
      minWidth: "190px",
      fontSize: "13px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    },
    medDetailName: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "6px",
      fontWeight: "700",
      color: "#1a202c",
    },
    medDetailRow: { color: "#6c757d", marginBottom: "3px" },
    authorizedBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      color: "#28a745",
      fontWeight: "600",
      fontSize: "13px",
      backgroundColor: "#d4edda",
      padding: "5px 10px",
      borderRadius: "20px",
    },
    rxId: {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#6c757d",
      backgroundColor: "#f8f9fa",
      padding: "3px 7px",
      borderRadius: "4px",
      display: "inline-block",
    },
    countBadge: {
      backgroundColor: "#e9ecef",
      padding: "3px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      color: "#495057",
      display: "inline-block",
    },
    loadingState: {
      textAlign: "center",
      padding: "50px 20px",
      color: "#6c757d",
      fontSize: "15px",
    },
    emptyState: {
      textAlign: "center",
      padding: "50px 20px",
      color: "#adb5bd",
      fontSize: "15px",
    },
    sectionDivider: {
      fontSize: "13px",
      fontWeight: "700",
      color: "#495057",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    actionCell: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      flexWrap: "wrap",
    },
  };

  // Shared expanded medications panel
  const MedicationsPanel = ({ medications, colSpan }) => (
    <tr>
      <td colSpan={colSpan} style={S.expandedTd}>
        <div style={S.expandedInner}>
          <div style={S.sectionDivider}>
            <FaPills color="#4361ee" />
            Medication Details
          </div>
          {medications && medications.length > 0 ? (
            <div style={S.medDetailGrid}>
              {medications.map((med, idx) => (
                <div key={idx} style={S.medDetailCard}>
                  <div style={S.medDetailName}>
                    <FaPills color="#4361ee" size={13} />
                    {med.name}
                  </div>
                  <div style={S.medDetailRow}>
                    <strong>Dosage:</strong> {med.dosage || "-"}
                  </div>
                  <div style={S.medDetailRow}>
                    <strong>Frequency:</strong> {med.frequency || "-"}
                  </div>
                  <div style={S.medDetailRow}>
                    <strong>Duration:</strong> {med.duration || "-"}
                  </div>
                  {med.notes && (
                    <div style={{ ...S.medDetailRow, color: "#868e96", fontStyle: "italic" }}>
                      Note: {med.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span style={{ color: "#adb5bd" }}>No medications listed.</span>
          )}
        </div>
      </td>
    </tr>
  );

  // Render
  return (
    <div style={S.page}>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />

      <div style={S.container}>

        {/* DOCTOR VIEW */}
        {role === "Doctor" && (
          <>
            <div style={S.pageHeader}>
              <h1 style={S.pageTitle}>
                <FaFileMedical color="#4361ee" />
                My Prescriptions
              </h1>
              <button
                style={{ ...S.btn, ...S.btnPrimary }}
                onClick={() => setShowForm((prev) => !prev)}
              >
                <FaPlus />
                {showForm ? "Close Form" : "Write New Prescription"}
              </button>
            </div>

            {showForm && (
              <div style={S.card}>
                <h2 style={S.cardTitle}>New Prescription</h2>
                <form onSubmit={handleSubmit}>
                  <div style={S.formRow2}>
                    <div style={S.formGroup}>
                      <label style={S.label}>Patient ID *</label>
                      <input
                        style={S.input}
                        type="text"
                        name="patientId"
                        value={form.patientId}
                        onChange={handleFormChange}
                        placeholder="e.g. 64ab12cd..."
                        required
                      />
                    </div>
                    <div style={S.formGroup}>
                      <label style={S.label}>Patient Name *</label>
                      <input
                        style={S.input}
                        type="text"
                        name="patientName"
                        value={form.patientName}
                        onChange={handleFormChange}
                        placeholder="Full name of patient"
                        required
                      />
                    </div>
                  </div>

                  <div style={S.formGroup}>
                    <label style={S.label}>Diagnosis</label>
                    <textarea
                      style={S.textarea}
                      name="diagnosis"
                      value={form.diagnosis}
                      onChange={handleFormChange}
                      placeholder="Describe the diagnosis..."
                    />
                  </div>

                  {/* Medications section */}
                  <div style={S.medSection}>
                    <div style={S.medSectionTitle}>
                      <FaPills color="#4361ee" />
                      Add Medications
                    </div>
                    <div style={S.medGrid}>
                      <div>
                        <label style={S.label}>Drug Name</label>
                        <input
                          style={S.input}
                          type="text"
                          name="name"
                          value={medLine.name}
                          onChange={handleMedLineChange}
                          placeholder="e.g. Amoxicillin"
                        />
                      </div>
                      <div>
                        <label style={S.label}>Dosage</label>
                        <input
                          style={S.input}
                          type="text"
                          name="dosage"
                          value={medLine.dosage}
                          onChange={handleMedLineChange}
                          placeholder="e.g. 500mg"
                        />
                      </div>
                      <div>
                        <label style={S.label}>Frequency</label>
                        <input
                          style={S.input}
                          type="text"
                          name="frequency"
                          value={medLine.frequency}
                          onChange={handleMedLineChange}
                          placeholder="e.g. 3x daily"
                        />
                      </div>
                      <div>
                        <label style={S.label}>Duration</label>
                        <input
                          style={S.input}
                          type="text"
                          name="duration"
                          value={medLine.duration}
                          onChange={handleMedLineChange}
                          placeholder="e.g. 7 days"
                        />
                      </div>
                      <div>
                        <label style={S.label}>Notes</label>
                        <input
                          style={S.input}
                          type="text"
                          name="notes"
                          value={medLine.notes}
                          onChange={handleMedLineChange}
                          placeholder="e.g. Take with food"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      style={{ ...S.btn, ...S.btnInfo }}
                      onClick={addMedication}
                    >
                      <FaPlus /> Add Medication
                    </button>
                    {form.medications.length > 0 && (
                      <ul style={S.medList}>
                        {form.medications.map((med, idx) => (
                          <li key={idx} style={S.medItem}>
                            <span style={S.medItemLeft}>
                              <FaPills color="#4361ee" size={13} />
                              <strong>{med.name}</strong>
                              {med.dosage && (
                                <span style={{ color: "#6c757d" }}>
                                  &mdash; {med.dosage}
                                </span>
                              )}
                              {med.frequency && (
                                <span style={{ color: "#868e96" }}>| {med.frequency}</span>
                              )}
                              {med.duration && (
                                <span style={{ color: "#868e96" }}>| {med.duration}</span>
                              )}
                              {med.notes && (
                                <span style={{ color: "#adb5bd", fontStyle: "italic" }}>
                                  | {med.notes}
                                </span>
                              )}
                            </span>
                            <button
                              type="button"
                              style={S.removeBtn}
                              onClick={() => removeMedication(idx)}
                              title="Remove medication"
                            >
                              <FaTimes size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div style={S.formActions}>
                    <button
                      type="button"
                      style={{ ...S.btn, ...S.btnSecondary }}
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ ...S.btn, ...S.btnSuccess }}
                    >
                      <FaFileMedical /> Submit Prescription
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Doctor prescriptions table */}
            <div style={S.card}>
              <h2 style={S.cardTitle}>Prescriptions Written</h2>
              {loading ? (
                <div style={S.loadingState}>Loading prescriptions...</div>
              ) : prescriptions.length === 0 ? (
                <div style={S.emptyState}>
                  No prescriptions found. Write your first prescription above.
                </div>
              ) : (
                <div style={S.tableWrapper}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Rx ID</th>
                        <th style={S.th}>Patient</th>
                        <th style={S.th}>Diagnosis</th>
                        <th style={S.th}>Medications</th>
                        <th style={S.th}>Status</th>
                        <th style={S.th}>Date</th>
                        <th style={S.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((rx, idx) => (
                        <React.Fragment key={rx._id}>
                          <tr>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              <span style={S.rxId}>{shortId(rx._id)}</span>
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              {rx.patientName || "-"}
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              <span
                                style={{
                                  maxWidth: "200px",
                                  display: "inline-block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  verticalAlign: "bottom",
                                }}
                                title={rx.diagnosis}
                              >
                                {rx.diagnosis || "-"}
                              </span>
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              <span style={S.countBadge}>
                                {rx.medications ? rx.medications.length : 0} drug(s)
                              </span>
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              <span style={getStatusBadgeStyle(rx.status)}>
                                {rx.status || "Active"}
                              </span>
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              {formatDate(rx.createdAt)}
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              <button
                                style={{ ...S.btn, ...S.btnInfo, ...S.btnSm }}
                                onClick={() => toggleRow(rx._id)}
                              >
                                {expandedRows[rx._id]
                                  ? <React.Fragment><FaChevronUp /> Hide</React.Fragment>
                                  : <React.Fragment><FaChevronDown /> Details</React.Fragment>}
                              </button>
                            </td>
                          </tr>
                          {expandedRows[rx._id] && (
                            <MedicationsPanel
                              medications={rx.medications}
                              colSpan={7}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* PATIENT VIEW */}
        {role === "Patient" && (
          <>
            <div style={S.pageHeader}>
              <h1 style={S.pageTitle}>
                <FaFileMedical color="#4361ee" />
                My Prescriptions
              </h1>
            </div>

            <div style={S.card}>
              {loading ? (
                <div style={S.loadingState}>Loading your prescriptions...</div>
              ) : prescriptions.length === 0 ? (
                <div style={S.emptyState}>You have no prescriptions on record.</div>
              ) : (
                <div style={S.tableWrapper}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Rx ID</th>
                        <th style={S.th}>Doctor</th>
                        <th style={S.th}>Hospital</th>
                        <th style={S.th}>Diagnosis</th>
                        <th style={S.th}>Medications</th>
                        <th style={S.th}>Status</th>
                        <th style={S.th}>Date</th>
                        <th style={S.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((rx, idx) => (
                        <React.Fragment key={rx._id}>
                          <tr>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              <span style={S.rxId}>{shortId(rx._id)}</span>
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              {rx.doctorName || rx.doctorId || "-"}
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              {rx.hospital || "-"}
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              <span
                                style={{
                                  maxWidth: "180px",
                                  display: "inline-block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  verticalAlign: "bottom",
                                }}
                                title={rx.diagnosis}
                              >
                                {rx.diagnosis || "-"}
                              </span>
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              <span style={S.countBadge}>
                                {rx.medications ? rx.medications.length : 0} drug(s)
                              </span>
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              <span style={getStatusBadgeStyle(rx.status)}>
                                {rx.status || "Active"}
                              </span>
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              {formatDate(rx.createdAt)}
                            </td>
                            <td style={idx % 2 === 0 ? S.td : S.tdAlt}>
                              <div style={S.actionCell}>
                                {rx.status === "Active" && !rx.patientAuthorized ? (
                                  <button
                                    style={{ ...S.btn, ...S.btnSuccess, ...S.btnSm }}
                                    onClick={() => handleAuthorize(rx.prescriptionId)}
                                  >
                                    <FaCheck size={11} /> Authorize
                                  </button>
                                ) : rx.patientAuthorized ? (
                                  <span style={S.authorizedBadge}>
                                    <FaCheck size={11} /> Authorized
                                  </span>
                                ) : null}
                                <button
                                  style={{ ...S.btn, ...S.btnInfo, ...S.btnSm }}
                                  onClick={() => toggleRow(rx._id)}
                                >
                                  {expandedRows[rx._id]
                                    ? <React.Fragment><FaChevronUp /> Hide</React.Fragment>
                                    : <React.Fragment><FaChevronDown /> Details</React.Fragment>}
                                </button>
                              </div>
                            </td>
                          </tr>
                          {expandedRows[rx._id] && (
                            <MedicationsPanel
                              medications={rx.medications}
                              colSpan={8}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Fallback when role cannot be determined */}
        {!role && (
          <div style={{ ...S.card, textAlign: "center", color: "#6c757d" }}>
            Unable to determine user role. Please log in again.
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default Prescriptions;
