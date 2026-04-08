import React, { useEffect, useState, useRef } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const FingerprintModal = ({ onClose, userId }) => {
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
            <h3 className="modal-title">Place Your Finger</h3>
            <p className="fp-blink">Put your finger on the scanner now...</p>
            <small>You will need to scan <strong>twice</strong> for accuracy.</small>
            <button className="btn btn-secondary-outline btn-sm" onClick={onClose}>Cancel</button>
          </div>
        )}

        {status === "success" && (
          <div className="fp-state-content">
            <FingerprintIcon color="var(--fp-success)" size={72} />
            <h3 className="modal-title" style={{ color: "var(--fp-success)" }}>Fingerprint Saved!</h3>
            <p>Your fingerprint has been enrolled successfully. Doctors can now identify you in an emergency.</p>
            <button className="btn btn-primary btn-full" onClick={onClose}>Done</button>
          </div>
        )}

        {status === "error" && (
          <div className="fp-state-content">
            <FingerprintIcon color="var(--fp-danger)" size={72} />
            <h3 className="modal-title" style={{ color: "var(--fp-danger)" }}>Enrollment Failed</h3>
            <p>{message}</p>
            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={triggerEnroll}>Retry</button>
              <button className="btn btn-secondary-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Profile() {
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    const decoded = jwt_decode(token);
    userId = decoded.userId;
  }

  const [loading, setLoading]               = useState(true);
  const [file, setFile]                     = useState("");
  const [showFpModal, setShowFpModal]       = useState(false);
  const [hasFingerprint, setHasFingerprint] = useState(false);

  const [formDetails, setFormDetails] = useState({
    firstname: "", lastname: "", email: "", phone: "", city: "", gender: "male", dateOfBirth: "",
  });

  const getUser = async () => {
    try {
      setLoading(true);
      const temp = await fetchData(`/api/user/getuser/${userId}`);
      if (temp) {
        setFormDetails({
          firstname: temp.firstname || "",
          lastname: temp.lastname || "",
          email: temp.email || "",
          phone: temp.phone || "",
          city: temp.city || "",
          gender: temp.gender || "male",
          dateOfBirth: temp.dateOfBirth ? temp.dateOfBirth.split("T")[0] : "",
        });
        setFile(temp.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
        setHasFingerprint(!!temp.fingerprintTemplateId);
      }
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) getUser();
  }, [userId]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormDetails({ ...formDetails, [name]: numericValue });
    } else {
      setFormDetails({ ...formDetails, [name]: value });
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formDetails.email) return toast.error("Email should not be empty");
      const { data } = await axios.put("/api/user/updateprofile", formDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Unable to update profile");
    }
  };

  const handleFpModalClose = () => {
    setShowFpModal(false);
    getUser();
  };

  return (
    <>
      <Navbar />
      {loading ? <Loading /> : (
        <section className="auth-section">
          <div className="auth-container" style={{ maxWidth: "600px" }}>
            <div className="auth-header">
              <h2 className="auth-title">My Profile</h2>
              <p className="auth-subtitle">Update your personal information</p>
            </div>

            <div className="flex-center" style={{ marginBottom: "2rem" }}>
              <img src={file} alt="profile" className="profile-pic" />
            </div>

            <form onSubmit={formSubmit} className="auth-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstname" className="form-input" value={formDetails.firstname} onChange={inputChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastname" className="form-input" value={formDetails.lastname} onChange={inputChange} required />
                </div>
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-input" value={formDetails.email} disabled />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" name="phone" className="form-input" value={formDetails.phone} onChange={inputChange} maxLength="10" inputMode="numeric" />
                </div>
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" className="form-input" value={formDetails.city} onChange={inputChange} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" className="form-input" value={formDetails.gender} onChange={inputChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" className="form-input" value={formDetails.dateOfBirth} onChange={inputChange} />
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: "1rem" }}>Update Profile</button>
            </form>

            <div className="fp-settings-box">
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <FingerprintIcon color={hasFingerprint ? "var(--fp-success)" : "var(--fp-primary)"} size={20} />
                  <strong style={{ fontSize: "0.95rem" }}>Fingerprint Security</strong>
                  {hasFingerprint && <span className="enrolled-tag">✓ Enrolled</span>}
                </div>
                <p style={{ fontSize: "0.85rem", opacity: 0.7, margin: 0 }}>
                  {hasFingerprint ? "Identity registered for emergencies." : "Register finger for emergency lookup."}
                </p>
              </div>
              <button type="button" className="btn btn-secondary-outline btn-sm" onClick={() => setShowFpModal(true)}>
                {hasFingerprint ? "Re-enroll" : "Enroll Now"}
              </button>
            </div>
          </div>
        </section>
      )}
      <Footer />
      {showFpModal && <FingerprintModal userId={userId} onClose={handleFpModalClose} />}
    </>
  );
}

const FingerprintIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M2 12a10 10 0 0 1 18-6" /><path d="M2 17.5a14.5 14.5 0 0 0 4.24 5.5" /><path d="M6 10a8 8 0 0 1 14.7-2.4" /><path d="M6 14a6 6 0 0 1 11.94-1.5" /><path d="M6.18 17A14 14 0 0 0 7 22" />
  </svg>
);

export default Profile;