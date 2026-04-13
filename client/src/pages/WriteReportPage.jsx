import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdTrash, IoMdArrowBack } from "react-icons/io";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FingerprintIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M2 12a10 10 0 0 1 18-6" /><path d="M2 17.5a14.5 14.5 0 0 0 4.24 5.5" /><path d="M6 10a8 8 0 0 1 14.7-2.4" /><path d="M6 14a6 6 0 0 1 11.94-1.5" /><path d="M6.18 17A14 14 0 0 0 7 22" />
  </svg>
);

const FingerprintModal = ({ onClose, userId, onSuccess }) => {
  const [status, setStatus]   = useState("activating");
  const [message, setMessage] = useState("");
  const pollRef = useRef(null);
  const token   = localStorage.getItem("token");

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };

  useEffect(() => {
    triggerEnroll();
    return () => {
      stopPolling();
      axios.post("/api/device/setmode", { mode: "idle" }, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    };
    // eslint-disable-next-line
  }, []);

  const triggerEnroll = async () => {
    setStatus("activating");
    try {
      await axios.post(
        "/api/device/setmode",
        { mode: "enroll", userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("scanning");
      startPolling();
    } catch (err) {
      setStatus("error");
      setMessage(err?.response?.data?.message || "Could not reach server");
    }
  };

  const startPolling = () => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get("/api/device/result", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success && data.data?.status === "enrolled") {
          setStatus("success");
          stopPolling();
          if (onSuccess) onSuccess();
        } else if (data.data?.status === "error") {
          setStatus("error");
          setMessage(data.data.message);
          stopPolling();
        }
      } catch (err) {}
    }, 2000);

    setTimeout(() => {
      if (pollRef.current) {
        stopPolling();
        setStatus("error");
        setMessage("Timeout: No finger detected in 60 seconds.");
      }
    }, 60000);
  };

  return (
    <div className="modal flex-center">
      <div className="modal-content" style={{ maxWidth: 420, textAlign: "center", padding: "2.5rem" }}>
        {status === "activating" && (
          <div className="fp-state-content">
            <FingerprintIcon color="var(--fp-warning)" size={72} />
            <h3 className="modal-title">Activating Device</h3>
            <p>Waking up the fingerprint scanner...</p>
          </div>
        )}

        {status === "scanning" && (
          <div className="fp-state-content">
             <div className="fp-icon-container">
                <div className="fp-ring fp-ring-1" />
                <div className="fp-ring fp-ring-2" />
                <div className="fp-ring fp-ring-3" />
                <span className="fp-pulse">
                  <FingerprintIcon color="var(--fp-primary)" size={72} />
                </span>
              </div>
            <h3 className="modal-title">Place Patient's Finger</h3>
            <p className="fp-blink">Ask patient to put their finger on the scanner now...</p>
            <small>They will need to scan <strong>twice</strong> for accuracy.</small>
            <div style={{ marginTop: "1rem" }}>
              <button type="button" className="btn btn-secondary-outline btn-sm" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="fp-state-content">
            <FingerprintIcon color="var(--fp-success)" size={72} />
            <h3 className="modal-title" style={{ color: "var(--fp-success)" }}>Fingerprint Saved!</h3>
            <p>Patient's fingerprint has been enrolled successfully.</p>
            <div style={{ marginTop: "1rem" }}>
              <button type="button" className="btn btn-primary btn-full" onClick={onClose}>Done</button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="fp-state-content">
            <FingerprintIcon color="var(--fp-danger)" size={72} />
            <h3 className="modal-title" style={{ color: "var(--fp-danger)" }}>Enrollment Failed</h3>
            <p>{message}</p>
            <div style={{ display: "flex", gap: "1rem", width: "100%", marginTop: "1rem" }}>
              <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={triggerEnroll}>Retry</button>
              <button type="button" className="btn btn-secondary-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WriteReportPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appt = state?.appt;

  const [formDetails, setFormDetails] = useState({
    diagnosis: "",
    notes: "",
    followUpDate: "",
    importance: "General",
  });

  const [images, setImages] = useState([]);

  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", duration: "", notes: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [hasFingerprint, setHasFingerprint] = useState(!!appt?.userId?.fingerprintTemplateId);
  const [showFpModal, setShowFpModal] = useState(false);

  const handleEnrollClick = async () => {
    try {
      const { data } = await axios.get("/api/device/doctor/my-device", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!data.data || !data.data.isActive) {
        toast.error("No scanner registered. Go to Device Setup to register your ESP32.");
      } else {
        setShowFpModal(true);
      }
    } catch(err) {
      toast.error("Could not verify device status.");
    }
  };

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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);
    const toastId = toast.loading("Uploading images...");
    try {
      const uploadedUrls = [];
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (>5MB)`);
          continue;
        }

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
        data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

        const res = await fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL, {
          method: "POST",
          body: data,
        });
        const uploadData = await res.json();
        if (uploadData.secure_url) {
          uploadedUrls.push(uploadData.secure_url.toString());
        } else if (uploadData.url) {
          uploadedUrls.push(uploadData.url.toString().replace("http://", "https://"));
        }
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} images uploaded successfully`, { id: toastId });
    } catch (err) {
      toast.error("Failed to upload images", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
        importance: formDetails.importance,
        images: images,
        medications: medications.filter(m => m.name.trim() !== ""), 
      };

      console.log("Saving report with importance:", payload.importance);

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <div>
                <h2 className="page-title">Publish Medical Report</h2>
                <p className="report-subtitle">
                  Patient: <strong>{appt?.userId?.firstname} {appt?.userId?.lastname}</strong> | Age: {appt?.age} | Gender: {appt?.gender}
                </p>
              </div>
              {!hasFingerprint && (
                <button type="button" className="btn btn-secondary-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={handleEnrollClick}>
                  <FingerprintIcon size={18} /> Enroll Fingerprint
                </button>
              )}
            </div>
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
                <label>Report Importance</label>
                <select 
                  name="importance" 
                  className="form-input" 
                  value={formDetails.importance} 
                  onChange={handleInputChange}
                >
                  <option value="General">General (Normal)</option>
                  <option value="Important">Important (Critical History)</option>
                </select>
                <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Important reports are shown by default to doctors in future visits.</small>
              </div>

              <div className="form-group">
                <label>Medical Images / Reports (Optional)</label>
                <div className="image-upload-wrapper">
                   <input type="file" multiple accept="image/*" onChange={handleImageUpload} id="report-images" hidden />
                   <label htmlFor="report-images" className="btn btn-secondary-outline btn-full" style={{ borderStyle: "dashed" }}>
                      <IoMdAdd /> Add Images
                   </label>
                </div>
                {images.length > 0 && (
                  <div className="image-preview-grid">
                    {images.map((img, idx) => (
                      <div key={idx} className="img-preview-item">
                        <img src={img} alt={`report-${idx}`} />
                        <button type="button" className="remove-img-btn" onClick={() => removeImage(idx)}>
                          <IoMdTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
      {showFpModal && (
        <FingerprintModal 
          userId={appt?.userId?._id} 
          onClose={() => setShowFpModal(false)} 
          onSuccess={() => setHasFingerprint(true)} 
        />
      )}
    </>
  );
};

export default WriteReportPage;
