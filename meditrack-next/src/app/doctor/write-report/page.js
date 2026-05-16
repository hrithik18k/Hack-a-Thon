"use client";

import { DoctorOnly } from "../../../middleware/route";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheckCircle, FiLoader, FiPlus, FiTrash2, FiUpload, FiXCircle } from "react-icons/fi";
import EditorialShell from "../../../components/editorial/EditorialShell";

const FingerprintIcon = ({ color = "currentColor", size = 20 }) => (
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

const FingerprintModal = ({ onClose, userId, onSuccess }) => {
  const [status, setStatus] = useState("activating");
  const [message, setMessage] = useState("");
  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get("/api/device/result");
        if (data.success && data.data?.status === "enrolled") {
          setStatus("success");
          stopPolling();
          onSuccess?.();
        } else if (data.data?.status === "error") {
          setStatus("error");
          setMessage(data.data.message);
          stopPolling();
        }
      } catch {}
    }, 2000);

    setTimeout(() => {
      if (pollRef.current) {
        stopPolling();
        setStatus("error");
        setMessage("Timeout: no finger detected in 60 seconds.");
      }
    }, 60000);
  }, [onSuccess, stopPolling]);

  const triggerEnroll = useCallback(async () => {
    setStatus("activating");
    try {
      await axios.post("/api/device/setmode", { mode: "enroll", userId });
      setStatus("scanning");
      startPolling();
    } catch (error) {
      setStatus("error");
      setMessage(error?.response?.data?.message || "Could not reach server");
    }
  }, [startPolling, userId]);

  useEffect(() => {
    triggerEnroll();
    return () => {
      stopPolling();
      axios.post("/api/device/setmode", { mode: "idle" }).catch(() => {});
    };
  }, [stopPolling, triggerEnroll]);

  return (
    <div className="editorial-overlay">
      <div className="editorial-modal-card editorial-modal-card-narrow">
        {status === "activating" ? (
          <div className="editorial-centered-state">
            <FiLoader className="editorial-spin" />
            <h3 className="editorial-card-title">Activating scanner</h3>
            <p>Preparing the fingerprint device for enrollment.</p>
          </div>
        ) : null}

        {status === "scanning" ? (
          <div className="editorial-centered-state">
            <FingerprintIcon color="var(--editorial-teal)" size={72} />
            <h3 className="editorial-card-title">Place the patient&apos;s finger on the scanner</h3>
            <p>Two scans may be required for a successful enrollment.</p>
            <button type="button" className="editorial-btn editorial-btn-outline" onClick={onClose}>Cancel</button>
          </div>
        ) : null}

        {status === "success" ? (
          <div className="editorial-centered-state">
            <FiCheckCircle className="editorial-success-icon" />
            <h3 className="editorial-card-title">Fingerprint saved</h3>
            <p>The patient can now be matched on this device during emergency lookup.</p>
            <button type="button" className="editorial-btn editorial-btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="editorial-centered-state">
            <FiXCircle className="editorial-danger-icon" />
            <h3 className="editorial-card-title">Enrollment failed</h3>
            <p>{message}</p>
            <div className="editorial-action-row">
              <button type="button" className="editorial-btn editorial-btn-primary" onClick={triggerEnroll}>Retry</button>
              <button type="button" className="editorial-btn editorial-btn-outline" onClick={onClose}>Close</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const WriteReportPage = () => {
  const router = useRouter();
  const [appt, setAppt] = useState(null);
  const [formDetails, setFormDetails] = useState({
    diagnosis: "",
    notes: "",
    followUpDate: "",
    importance: "General",
  });
  const [images, setImages] = useState([]);
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "", notes: "" }]);
  const [loading, setLoading] = useState(false);
  const [hasFingerprintOnCurrentDevice, setHasFingerprintOnCurrentDevice] = useState(false);
  const [hasAnyFingerprint, setHasAnyFingerprint] = useState(false);
  const [showFpModal, setShowFpModal] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("writeReportAppointment");
    if (!stored) {
      router.push("/appointments");
      return;
    }
    setAppt(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    async function loadFingerprintStatus() {
      if (!appt?.userId?._id) {
        return;
      }
      try {
        const { data } = await axios.get(`/api/device/patient/${appt.userId._id}/status`);
        if (data.success && data.data) {
          setHasAnyFingerprint(!!data.data.hasAnyFingerprint);
          setHasFingerprintOnCurrentDevice(!!data.data.hasTemplateOnCurrentDevice);
        }
      } catch {
        setHasAnyFingerprint(!!appt?.userId?.fingerprintTemplateId);
        setHasFingerprintOnCurrentDevice(!!appt?.userId?.fingerprintTemplateId);
      }
    }

    loadFingerprintStatus();
  }, [appt]);

  const handleEnrollClick = async () => {
    try {
      const { data } = await axios.get("/api/device/doctor/my-device");
      if (!data.data || !data.data.isActive) {
        toast.error("No scanner registered. Go to Device Setup to register your ESP32.");
        return;
      }
      setShowFpModal(true);
    } catch {
      toast.error("Could not verify device status.");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicationChange = (index, event) => {
    const { name, value } = event.target;
    setMedications((prev) => prev.map((medication, medIndex) => (
      medIndex === index ? { ...medication, [name]: value } : medication
    )));
  };

  const addMedicationRow = () => {
    setMedications((prev) => [...prev, { name: "", dosage: "", frequency: "", duration: "", notes: "" }]);
  };

  const removeMedicationRow = (index) => {
    setMedications((prev) => prev.filter((_, medIndex) => medIndex !== index));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

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
        data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
        data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

        const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL, {
          method: "POST",
          body: data,
        });
        const uploadData = await response.json();
        if (uploadData.secure_url) {
          uploadedUrls.push(uploadData.secure_url.toString());
        } else if (uploadData.url) {
          uploadedUrls.push(uploadData.url.toString().replace("http://", "https://"));
        }
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`, { id: toastId });
    } catch {
      toast.error("Failed to upload images", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  const submitReport = async (event) => {
    event.preventDefault();
    if (loading || !appt) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        appointmentId: appt._id,
        diagnosis: formDetails.diagnosis,
        notes: formDetails.notes,
        followUpDate: formDetails.followUpDate,
        importance: formDetails.importance,
        images,
        medications: medications.filter((medication) => medication.name.trim() !== ""),
      };

      const { data } = await axios.post("/api/report/create", payload);
      if (data.success) {
        toast.success("Report saved and published successfully");
        router.push("/appointments");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save report");
    } finally {
      setLoading(false);
    }
  };

  if (!appt) {
    return null;
  }

  return (
    <EditorialShell>
      <main className="editorial-page">
        <section className="editorial-page-hero">
          <div className="editorial-shell">
            <button className="editorial-btn editorial-btn-outline" onClick={() => router.push("/appointments")}>
              <FiArrowLeft />
              <span>Back to appointments</span>
            </button>

            <div className="editorial-page-head-row">
              <div>
                <span className="editorial-eyebrow">Doctor reporting</span>
                <h1 className="editorial-page-title">Publish a structured medical report for this visit.</h1>
                <p className="editorial-lede">
                  Patient: <strong>{appt?.userId?.firstname} {appt?.userId?.lastname}</strong> | Age: {appt?.age} | Gender: {appt?.gender}
                </p>
              </div>
              {!hasFingerprintOnCurrentDevice ? (
                <button type="button" className="editorial-btn editorial-btn-primary" onClick={handleEnrollClick}>
                  <FingerprintIcon />
                  <span>{hasAnyFingerprint ? "Enroll on this device" : "Enroll fingerprint"}</span>
                </button>
              ) : null}
            </div>

            {hasAnyFingerprint && !hasFingerprintOnCurrentDevice ? (
              <p className="editorial-inline-note">
                This patient already has a fingerprint enrolled elsewhere. Add one on this device to support local emergency matching.
              </p>
            ) : null}
          </div>
        </section>

        <section className="editorial-section editorial-section-tight">
          <div className="editorial-shell">
            <form onSubmit={submitReport} className="editorial-report-grid">
              <div className="editorial-form-card">
                <h2 className="editorial-card-title">Clinical summary</h2>
                <div className="editorial-stack">
                  <div className="form-field">
                    <label className="editorial-label">Primary diagnosis</label>
                    <input type="text" name="diagnosis" className="editorial-input" placeholder="Example: Viral pharyngitis" value={formDetails.diagnosis} onChange={handleInputChange} required />
                  </div>

                  <div className="form-field">
                    <label className="editorial-label">Doctor notes and observations</label>
                    <textarea name="notes" className="editorial-input editorial-textarea" rows={8} placeholder="Include symptoms, clinical findings, tests, or care advice." value={formDetails.notes} onChange={handleInputChange} />
                  </div>

                  <div className="editorial-form-grid">
                    <div className="form-field">
                      <label className="editorial-label">Report importance</label>
                      <select name="importance" className="editorial-input" value={formDetails.importance} onChange={handleInputChange}>
                        <option value="General">General</option>
                        <option value="Important">Important</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="editorial-label">Follow-up date</label>
                      <input type="date" name="followUpDate" className="editorial-input" value={formDetails.followUpDate} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="editorial-label">Medical images and attachments</label>
                    <label className="editorial-upload-tile" htmlFor="report-images">
                      <FiUpload />
                      <span>Upload clinical images or report scans</span>
                    </label>
                    <input id="report-images" type="file" multiple accept="image/*" onChange={handleImageUpload} hidden />
                    {images.length ? (
                      <div className="editorial-media-grid">
                        {images.map((image, index) => (
                          <div key={`${image}-${index}`} className="editorial-media-thumb is-static">
                            <img src={image} alt={`report-${index}`} />
                            <button type="button" className="remove-img-btn" onClick={() => removeImage(index)}>
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="editorial-form-card">
                <div className="editorial-page-head-row">
                  <div>
                    <h2 className="editorial-card-title">Prescription plan</h2>
                    <p className="editorial-helper-text">Add medications only when they are needed for this consultation.</p>
                  </div>
                  <button type="button" className="editorial-btn editorial-btn-outline editorial-btn-sm" onClick={addMedicationRow}>
                    <FiPlus />
                    <span>Add medication</span>
                  </button>
                </div>

                <div className="editorial-stack">
                  {medications.map((medication, index) => (
                    <div key={`${index}-${medication.name}`} className="editorial-medication-card">
                      <div className="editorial-page-head-row">
                        <strong>Medication {index + 1}</strong>
                        {medications.length > 1 ? (
                          <button type="button" className="editorial-btn editorial-btn-danger editorial-btn-sm" onClick={() => removeMedicationRow(index)}>
                            <FiTrash2 />
                            <span>Remove</span>
                          </button>
                        ) : null}
                      </div>

                      <div className="editorial-form-grid">
                        <div className="form-field editorial-form-grid-span-2">
                          <label className="editorial-label">Drug name</label>
                          <input type="text" name="name" className="editorial-input" placeholder="Example: Amoxicillin 500mg" value={medication.name} onChange={(event) => handleMedicationChange(index, event)} />
                        </div>
                        <div className="form-field">
                          <label className="editorial-label">Dosage</label>
                          <input type="text" name="dosage" className="editorial-input" placeholder="1 tablet" value={medication.dosage} onChange={(event) => handleMedicationChange(index, event)} />
                        </div>
                        <div className="form-field">
                          <label className="editorial-label">Frequency</label>
                          <input type="text" name="frequency" className="editorial-input" placeholder="Twice daily" value={medication.frequency} onChange={(event) => handleMedicationChange(index, event)} />
                        </div>
                        <div className="form-field">
                          <label className="editorial-label">Duration</label>
                          <input type="text" name="duration" className="editorial-input" placeholder="7 days" value={medication.duration} onChange={(event) => handleMedicationChange(index, event)} />
                        </div>
                        <div className="form-field">
                          <label className="editorial-label">Notes</label>
                          <input type="text" name="notes" className="editorial-input" placeholder="After meals, if needed, etc." value={medication.notes} onChange={(event) => handleMedicationChange(index, event)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="editorial-btn editorial-btn-primary editorial-btn-block" disabled={loading}>
                  {loading ? "Publishing report..." : "Complete and publish report"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {showFpModal ? (
        <FingerprintModal
          userId={appt?.userId?._id}
          onClose={() => setShowFpModal(false)}
          onSuccess={() => {
            setHasAnyFingerprint(true);
            setHasFingerprintOnCurrentDevice(true);
          }}
        />
      ) : null}
    </EditorialShell>
  );
};

const DoctorWriteReportPage = () => <DoctorOnly><WriteReportPage /></DoctorOnly>;

export default DoctorWriteReportPage;

FingerprintIcon.propTypes = {
  color: PropTypes.any,
  size: PropTypes.any,
};

FingerprintModal.propTypes = {
  onClose: PropTypes.any,
  userId: PropTypes.any,
  onSuccess: PropTypes.any,
};
