import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdTrash, IoMdArrowBack } from "react-icons/io";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/writereportpage.css";

const WriteReportPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appt = state?.appt;

  const [formDetails, setFormDetails] = useState({
    diagnosis: "",
    notes: "",
    followUpDate: "",
  });

  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", duration: "", notes: "" }
  ]);
  const [loading, setLoading] = useState(false);

  // If directly navigated without state, redirect back
  if (!appt) {
    navigate("/appointments");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target;
    const newMedications = [...medications];
    newMedications[index][name] = value;
    setMedications(newMedications);
  };

  const addMedicationRow = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "", notes: "" }]);
  };

  const removeMedicationRow = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const submitReport = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      
      const payload = {
        appointmentId: appt._id,
        diagnosis: formDetails.diagnosis,
        notes: formDetails.notes,
        followUpDate: formDetails.followUpDate,
        medications: medications.filter(m => m.name.trim() !== ""), 
      };

      const { data } = await axios.post("/api/report/create", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.success) {
        toast.success("Report saved and published successfully!");
        navigate("/appointments");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="report-page-section">
        <div className="container">
          <button className="back-btn" onClick={() => navigate("/appointments")}>
            <IoMdArrowBack /> Back to Appointments
          </button>
          
          <div className="report-header">
            <h2 className="page-title">Publish Medical Report</h2>
            <p className="report-subtitle">
              Patient: <strong>{appt?.userId?.firstname} {appt?.userId?.lastname}</strong> | Age: {appt?.age} | Gender: {appt?.gender}
            </p>
          </div>

          <form onSubmit={submitReport} className="report-grid-form">
            
            {/* Left Column: Summary & Diagnosis */}
            <div className="report-card summary-card">
              <h3 className="card-heading">Patient Summary & Diagnosis</h3>
              
              <div className="form-group">
                <label>Primary Diagnosis *</label>
                <input
                  type="text"
                  name="diagnosis"
                  className="form-input"
                  placeholder="e.g. Viral Pharyngitis"
                  value={formDetails.diagnosis}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Doctor Notes / Observations</label>
                <textarea
                  name="notes"
                  className="form-input"
                  placeholder="Include symptoms, test results, or dietary recommendations..."
                  rows={8}
                  value={formDetails.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Follow-up Date (Optional)</label>
                <input
                  type="date"
                  name="followUpDate"
                  className="form-input"
                  value={formDetails.followUpDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Right Column: Prescription Section */}
            <div className="report-card prescription-card">
              <div className="card-heading-row">
                <h3 className="card-heading">Prescription</h3>
                <button type="button" className="btn-secondary-outline btn-sm" onClick={addMedicationRow}>
                  <IoMdAdd /> Add Medication
                </button>
              </div>

              <div className="medications-container">
                {medications.map((med, index) => (
                  <div key={index} className="medication-box">
                    <div className="med-box-header">
                      <span>Medication #{index + 1}</span>
                      {medications.length > 1 && (
                        <button type="button" className="remove-med-btn" onClick={() => removeMedicationRow(index)}>
                          <IoMdTrash /> Remove
                        </button>
                      )}
                    </div>
                    <div className="med-box-grid">
                      <div className="form-group full-width">
                        <label>Drug Name</label>
                        <input type="text" name="name" className="form-input" placeholder="e.g. Amoxicillin 500mg" value={med.name} onChange={(e) => handleMedicationChange(index, e)} />
                      </div>
                      <div className="form-group">
                        <label>Dosage</label>
                        <input type="text" name="dosage" className="form-input" placeholder="e.g. 1 Tablet" value={med.dosage} onChange={(e) => handleMedicationChange(index, e)} />
                      </div>
                      <div className="form-group">
                        <label>Frequency</label>
                        <input type="text" name="frequency" className="form-input" placeholder="e.g. Twice a day" value={med.frequency} onChange={(e) => handleMedicationChange(index, e)} />
                      </div>
                      <div className="form-group full-width">
                        <label>Duration</label>
                        <input type="text" name="duration" className="form-input" placeholder="e.g. 7 Days" value={med.duration} onChange={(e) => handleMedicationChange(index, e)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="submit-section">
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? "Publishing Report..." : "Complete & Publish Report"}
                </button>
              </div>
            </div>

          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default WriteReportPage;
