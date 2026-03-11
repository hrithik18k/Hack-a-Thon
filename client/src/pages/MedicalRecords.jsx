import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jwtDecode from "jwt-decode";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHeartbeat, FaBan, FaPills, FaSyringe, FaNotesMedical, FaPlus } from "react-icons/fa";
import "../styles/medicalrecords.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const MedicalRecords = () => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("vitals");
  const [showAddVital, setShowAddVital] = useState(false);
  const [vitalForm, setVitalForm] = useState({
    bloodPressure: "", heartRate: "", temperature: "", weight: "", oxygenSaturation: "",
  });
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [newAllergy, setNewAllergy] = useState("");
  const [emergencyContact, setEmergencyContact] = useState({ name: "", relation: "", phone: "" });
  const [bloodGroup, setBloodGroup] = useState("");
  const [editingBloodGroup, setEditingBloodGroup] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/medicalrecord/myrecord", authHeader);
      const recordData = data.data;
      setRecord(recordData);
      setBloodGroup(recordData?.bloodGroup || "");
      setSelectedBloodGroup(recordData?.bloodGroup || "");
      if (recordData?.emergencyContact) setEmergencyContact(recordData.emergencyContact);
    } catch (err) {
      toast.error("Failed to load medical record.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRecord(); }, []);

  const handleVitalSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/medicalrecord/vitalsign", vitalForm, authHeader);
      toast.success("Vital sign added successfully.");
      setShowAddVital(false);
      setVitalForm({ bloodPressure: "", heartRate: "", temperature: "", weight: "", oxygenSaturation: "" });
      fetchRecord();
    } catch (err) { toast.error("Failed to add vital sign."); }
  };

  const handleAddAllergy = async () => {
    if (!newAllergy.trim()) { toast.error("Please enter an allergy."); return; }
    try {
      const updated = [...(record.allergies || []), newAllergy.trim()];
      await axios.put("/api/medicalrecord/update", { allergies: updated }, authHeader);
      toast.success("Allergy added.");
      setNewAllergy(""); setShowAddAllergy(false); fetchRecord();
    } catch (err) { toast.error("Failed to add allergy."); }
  };

  const handleEmergencyContactSave = async () => {
    try {
      await axios.put("/api/medicalrecord/update", { emergencyContact }, authHeader);
      toast.success("Emergency contact updated."); fetchRecord();
    } catch (err) { toast.error("Failed to update emergency contact."); }
  };

  const handleBloodGroupSave = async () => {
    try {
      await axios.put("/api/medicalrecord/update", { bloodGroup: selectedBloodGroup }, authHeader);
      toast.success("Blood group updated."); setEditingBloodGroup(false); fetchRecord();
    } catch (err) { toast.error("Failed to update blood group."); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : "N/A";

  const tabs = [
    { id: "vitals", label: "Vital Signs", icon: <FaHeartbeat /> },
    { id: "allergies", label: "Allergies", icon: <FaBan /> },
    { id: "diagnoses", label: "Diagnoses", icon: <FaNotesMedical /> },
    { id: "medications", label: "Medications", icon: <FaPills /> },
    { id: "surgeries", label: "Surgeries", icon: <FaSyringe /> },
    { id: "emergency", label: "Emergency Contact", icon: <FaPlus /> },
  ];

  return (
    <>
      <Navbar />
      <div className="medical-records-container">
        <div className="medical-header"><h2>My Medical Records</h2></div>

        {loading ? (
          <p>Loading...</p>
        ) : record ? (
          <>
            <div className="blood-group-section">
              <span style={{ fontWeight: 600, color: "#333" }}>Blood Group:</span>
              {editingBloodGroup ? (
                <>
                  <select value={selectedBloodGroup}
                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                    style={{ padding: ".3rem .6rem", border: "1px solid #ddd", borderRadius: "6px" }}>
                    <option value="">Select</option>
                    {bloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                  <button className="btn-primary btn-sm" onClick={handleBloodGroupSave}>Save</button>
                  <button className="btn-sm"
                    style={{ background: "#eee", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    onClick={() => setEditingBloodGroup(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <span className="blood-group-badge">{bloodGroup || "Not Set"}</span>
                  <button className="btn-primary btn-sm" onClick={() => setEditingBloodGroup(true)}>Edit</button>
                </>
              )}
            </div>

            <div className="tabs">
              {tabs.map((tab) => (
                <button key={tab.id}
                  className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}>
                  {tab.icon}&nbsp;{tab.label}
                </button>
              ))}
            </div>

            {activeTab === "vitals" && (
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <button className="btn-primary"
                    onClick={() => setShowAddVital((p) => !p)}>
                    <FaPlus /> Add Vital Sign
                  </button>
                </div>
                {showAddVital && (
                  <form className="add-form" onSubmit={handleVitalSubmit}>
                    <div>
                      <label style={{ display: "block", fontSize: ".8rem", marginBottom: ".2rem" }}>Blood Pressure</label>
                      <input type="text" placeholder="e.g. 120/80" value={vitalForm.bloodPressure}
                        onChange={(e) => setVitalForm({ ...vitalForm, bloodPressure: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: ".8rem", marginBottom: ".2rem" }}>Heart Rate (bpm)</label>
                      <input type="number" placeholder="e.g. 72" value={vitalForm.heartRate}
                        onChange={(e) => setVitalForm({ ...vitalForm, heartRate: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: ".8rem", marginBottom: ".2rem" }}>Temperature (F)</label>
                      <input type="number" placeholder="e.g. 98.6" value={vitalForm.temperature}
                        onChange={(e) => setVitalForm({ ...vitalForm, temperature: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: ".8rem", marginBottom: ".2rem" }}>Weight (kg)</label>
                      <input type="number" placeholder="e.g. 70" value={vitalForm.weight}
                        onChange={(e) => setVitalForm({ ...vitalForm, weight: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: ".8rem", marginBottom: ".2rem" }}>O2 Saturation (%)</label>
                      <input type="number" placeholder="e.g. 98" value={vitalForm.oxygenSaturation}
                        onChange={(e) => setVitalForm({ ...vitalForm, oxygenSaturation: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-primary">Save Vital</button>
                    <button type="button" className="btn-sm"
                      style={{ background: "#eee", border: "none", borderRadius: "6px", cursor: "pointer" }}
                      onClick={() => setShowAddVital(false)}>Cancel</button>
                  </form>
                )}
                <div className="table-wrapper">
                  <table>
                    <thead><tr>
                      <th>Date</th><th>Blood Pressure</th><th>Heart Rate</th>
                      <th>Temperature</th><th>Weight</th><th>O2 Saturation</th>
                    </tr></thead>
                    <tbody>
                      {record.vitalSigns && record.vitalSigns.length > 0 ? (
                        [...record.vitalSigns].slice(-10).reverse().map((v, i) => (
                          <tr key={i}>
                            <td>{formatDate(v.date || v.recordedAt)}</td>
                            <td>{v.bloodPressure || "N/A"}</td>
                            <td>{v.heartRate || "N/A"}</td>
                            <td>{v.temperature || "N/A"}</td>
                            <td>{v.weight || "N/A"}</td>
                            <td>{v.oxygenSaturation || "N/A"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={6} style={{ textAlign: "center", color: "#999" }}>No vital signs recorded.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "allergies" && (
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  {record.allergies && record.allergies.length > 0 ? (
                    <div>{record.allergies.map((a, i) => <span key={i} className="allergy-chip">{a}</span>)}</div>
                  ) : (<p style={{ color: "#999" }}>No allergies recorded.</p>)}
                </div>
                <button className="btn-primary" onClick={() => setShowAddAllergy((p) => !p)}>
                  <FaPlus /> Add Allergy
                </button>
                {showAddAllergy && (
                  <div className="add-form" style={{ marginTop: "1rem" }}>
                    <input type="text" placeholder="Enter allergy (e.g. Penicillin)"
                      value={newAllergy} onChange={(e) => setNewAllergy(e.target.value)} />
                    <button className="btn-primary" onClick={handleAddAllergy}>Save</button>
                    <button className="btn-sm"
                      style={{ background: "#eee", border: "none", borderRadius: "6px", cursor: "pointer" }}
                      onClick={() => { setShowAddAllergy(false); setNewAllergy(""); }}>Cancel</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "diagnoses" && (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Date</th><th>Doctor</th><th>Hospital</th><th>Diagnosis</th><th>Notes</th></tr></thead>
                  <tbody>
                    {record.diagnoses && record.diagnoses.length > 0 ? (
                      record.diagnoses.map((d, i) => (
                        <tr key={i}>
                          <td>{formatDate(d.date)}</td><td>{d.doctorName || "N/A"}</td>
                          <td>{d.hospital || "N/A"}</td><td>{d.diagnosis || "N/A"}</td>
                          <td>{d.notes || "—"}</td>
                        </tr>
                      ))
                    ) : (<tr><td colSpan={5} style={{ textAlign: "center", color: "#999" }}>No diagnoses recorded.</td></tr>)}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "medications" && (
              <div className="table-wrapper">
                <table>
                  <thead><tr>
                    <th>Name</th><th>Dosage</th><th>Frequency</th>
                    <th>Start Date</th><th>End Date</th><th>Prescribed By</th><th>Status</th>
                  </tr></thead>
                  <tbody>
                    {record.medications && record.medications.length > 0 ? (
                      record.medications.map((med, i) => (
                        <tr key={i}>
                          <td>{med.name || "N/A"}</td><td>{med.dosage || "N/A"}</td>
                          <td>{med.frequency || "N/A"}</td><td>{formatDate(med.startDate)}</td>
                          <td>{formatDate(med.endDate)}</td><td>{med.prescribedBy || "N/A"}</td>
                          <td>
                            <span className={`badge ${med.status === "Active" ? "badge-green" : "badge-red"}`}>
                              {med.status || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (<tr><td colSpan={7} style={{ textAlign: "center", color: "#999" }}>No medications recorded.</td></tr>)}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "surgeries" && (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Date</th><th>Procedure</th><th>Hospital</th><th>Surgeon</th><th>Notes</th></tr></thead>
                  <tbody>
                    {record.surgeries && record.surgeries.length > 0 ? (
                      record.surgeries.map((s, i) => (
                        <tr key={i}>
                          <td>{formatDate(s.date)}</td><td>{s.procedure || "N/A"}</td>
                          <td>{s.hospital || "N/A"}</td><td>{s.surgeon || "N/A"}</td>
                          <td>{s.notes || "—"}</td>
                        </tr>
                      ))
                    ) : (<tr><td colSpan={5} style={{ textAlign: "center", color: "#999" }}>No surgeries recorded.</td></tr>)}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "emergency" && (
              <div style={{ maxWidth: "500px" }}>
                <h3 style={{ marginBottom: "1rem", color: "#333" }}>Emergency Contact</h3>
                <div className="add-form" style={{ flexDirection: "column", alignItems: "stretch" }}>
                  <div>
                    <label style={{ display: "block", fontSize: ".85rem", marginBottom: ".3rem", color: "#555" }}>Name</label>
                    <input type="text" placeholder="Contact name" value={emergencyContact.name}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                      style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: ".85rem", marginBottom: ".3rem", color: "#555" }}>Relation</label>
                    <input type="text" placeholder="e.g. Spouse, Parent" value={emergencyContact.relation}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, relation: e.target.value })}
                      style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: ".85rem", marginBottom: ".3rem", color: "#555" }}>Phone</label>
                    <input type="text" placeholder="Phone number" value={emergencyContact.phone}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                      style={{ width: "100%" }} />
                  </div>
                  <button className="btn-primary" onClick={handleEmergencyContactSave}>
                    Save Emergency Contact
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "#999" }}>No medical record found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MedicalRecords;
