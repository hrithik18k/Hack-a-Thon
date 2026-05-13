"use client";

import { Public } from "../../middleware/route";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import toast from "react-hot-toast";

axios.defaults.baseURL = getApiBaseUrl();

function Register() {
  const [file, setFile] = useState("");
  const [certFile, setCertFile] = useState("");
  const [selectedRole, setSelectedRole] = useState("Patient");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
    phone: "",
    city: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    permanentAddress: "",
    temporaryAddress: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone1: "",
    emergencyPhone2: "",
    // Doctor specific fields:
    specialization: "",
    experience: "",
    fees: "",
    qualifications: "",
    hospitalName: "",
  });

  // Track which fields have been touched (blurred)
  const [touched, setTouched] = useState({});

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Validation logic — returns error string or empty
  const getFieldError = (name, value) => {
    switch (name) {
      case "firstname":
      case "lastname":
        if (value.length > 0 && value.length < 3) return "Must be at least 3 characters";
        return "";
      case "email": {
        if (!value) return "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Enter a valid email address";
        return "";
      }
      case "password":
        if (!value) return "";
        if (value.length < 8) return "Must be at least 8 characters";
        if (!/\d/.test(value)) return "Must contain at least one number";
        return "";
      case "confpassword":
        if (!value) return "";
        if (value !== formDetails.password) return "Passwords do not match";
        return "";
      case "phone":
        if (value.length > 0 && value.length < 10) return "Phone number must be exactly 10 digits";
        return "";
      case "emergencyPhone1":
      case "emergencyPhone2":
        if (value.length > 0 && value.length < 10) return "Must be exactly 10 digits";
        return "";
      default:
        return "";
    }
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "emergencyPhone1" || name === "emergencyPhone2") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormDetails({ ...formDetails, [name]: numericValue });
    } else {
      setFormDetails({ ...formDetails, [name]: value });
    }
  };

  const onUpload = async (element, type = "profile") => {
    setLoading(true);
    if (element.type === "image/jpeg" || element.type === "image/png" || element.type === "image/jpg" || element.type === "application/pdf") {
      const data = new FormData();
      data.append("file", element);
      data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
      data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

      try {
        const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL, {
          method: "POST",
          body: data,
        });
        const uploadData = await res.json();
        if (type === "profile") {
          setFile(uploadData.url.toString());
          toast.success("Profile picture uploaded successfully");
        } else {
          setCertFile(uploadData.url.toString());
          toast.success("Certificate uploaded successfully");
        }
      } catch (err) {
        toast.error("Failed to upload file");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.error("Please select an image (jpeg/png/jpg) or PDF");
    }
  };

  const validateForm = () => {
    const allTouched = {};
    Object.keys(formDetails).forEach(k => allTouched[k] = true);
    setTouched(allTouched);

    const fieldsToCheck = ["firstname", "lastname", "email", "password", "confpassword", "phone"];
    for (const field of fieldsToCheck) {
      const err = getFieldError(field, formDetails[field]);
      if (err) return err;
    }

    if (formDetails.password !== formDetails.confpassword) return "Passwords do not match";

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formDetails.phone)) return "Phone number must be exactly 10 digits";

    if (selectedRole === "Patient") {
      if (!phoneRegex.test(formDetails.emergencyPhone1) || (formDetails.emergencyPhone2 && !phoneRegex.test(formDetails.emergencyPhone2))) {
        return "Emergency phone numbers must be exactly 10 digits";
      }
    }
    return null;
  };

  const buildPayload = () => {
    const payload = {
      firstname: formDetails.firstname,
      lastname: formDetails.lastname,
      email: formDetails.email,
      password: formDetails.password,
      phone: formDetails.phone,
      city: formDetails.city,
      pic: file,
      role: selectedRole,
    };

    if (selectedRole === "Patient") {
      Object.assign(payload, {
        dateOfBirth: formDetails.dateOfBirth,
        gender: formDetails.gender,
        bloodGroup: formDetails.bloodGroup,
        permanentAddress: formDetails.permanentAddress,
        temporaryAddress: formDetails.temporaryAddress,
        emergencyContact: {
          name: formDetails.emergencyName,
          relation: formDetails.emergencyRelation,
          phone1: formDetails.emergencyPhone1,
          phone2: formDetails.emergencyPhone2,
        }
      });
    } else if (selectedRole === "Doctor") {
      Object.assign(payload, {
        specialization: formDetails.specialization,
        experience: formDetails.experience,
        fees: formDetails.fees,
        qualifications: formDetails.qualifications,
        hospitalName: formDetails.hospitalName,
        certificate: certFile,
      });
    }
    return payload;
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    try {
      const payload = buildPayload();
      const response = await axios.post("/api/user/register", payload);
      
      if (response.data.success) {
        toast.success(response.data.message || "User registered successfully!");
        router.push("/login");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    }
  };

  // Helper to render inline error
  const renderError = (fieldName) => {
    if (!touched[fieldName]) return null;
    const error = getFieldError(fieldName, formDetails[fieldName]);
    if (!error) return null;
    return <span className="field-error">{error}</span>;
  };

  const getSubmitText = () => {
    if (loading) return "Processing...";
    if (selectedRole === "Doctor") return "Apply as Doctor";
    return "Register";
  };

  return (
    <>
      <Navbar />
      <section className="auth-section">
        <div className="auth-container register-container">
          <h2 className="auth-heading">Create an Account</h2>
          
          <div className="role-selector">
            <button 
              className={`role-btn ${selectedRole === "Patient" ? "active" : ""}`}
              onClick={() => setSelectedRole("Patient")}
            >
              Patient
            </button>
            <button 
              className={`role-btn ${selectedRole === "Doctor" ? "active" : ""}`}
              onClick={() => setSelectedRole("Doctor")}
            >
              Doctor
            </button>
          </div>

          <form onSubmit={formSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-field">
                <input type="text" name="firstname" className="form-input" placeholder="First Name" value={formDetails.firstname} onChange={inputChange} onBlur={handleBlur} required />
                {renderError("firstname")}
              </div>
              <div className="form-field">
                <input type="text" name="lastname" className="form-input" placeholder="Last Name" value={formDetails.lastname} onChange={inputChange} onBlur={handleBlur} required />
                {renderError("lastname")}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <input type="email" name="email" className="form-input" placeholder="Email Address" value={formDetails.email} onChange={inputChange} onBlur={handleBlur} required />
                {renderError("email")}
              </div>
              <div className="form-field">
                <input type="tel" name="phone" className="form-input" placeholder="Phone Number" value={formDetails.phone} onChange={inputChange} onBlur={handleBlur} required maxLength="10" inputMode="numeric" />
                {renderError("phone")}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <input type="password" name="password" className="form-input" placeholder="Password" value={formDetails.password} onChange={inputChange} onBlur={handleBlur} required />
                {renderError("password")}
              </div>
              <div className="form-field">
                <input type="password" name="confpassword" className="form-input" placeholder="Confirm Password" value={formDetails.confpassword} onChange={inputChange} onBlur={handleBlur} required />
                {renderError("confpassword")}
              </div>
            </div>

            <div className="form-row">
              <input type="text" name="city" className="form-input" placeholder="City" value={formDetails.city} onChange={inputChange} required />
              <div className="file-input-wrapper" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Profile Picture</label>
                <input type="file" onChange={(e) => onUpload(e.target.files[0], "profile")} name="profile-pic" className="form-input file-input" />
              </div>
            </div>

            {selectedRole === "Patient" && (
              <>
                <div className="form-row">
                  <div className="form-field" style={{ position: "relative" }}>
                    <small style={{ position: "absolute", top: "-18px", left: "4px", color: "var(--text-secondary)", fontSize: "0.75rem" }}>Date of Birth</small>
                    <input type="date" name="dateOfBirth" className="form-input" value={formDetails.dateOfBirth} onChange={inputChange} required title="Date of Birth" />
                  </div>
                  <div className="form-field">
                    <select name="gender" className="form-input" value={formDetails.gender} onChange={inputChange} required>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <select name="bloodGroup" className="form-input" value={formDetails.bloodGroup} onChange={inputChange} required>
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="form-field">
                    {/* Placeholder div if needed to keep flex balance, or we can just let blood group occupy half */}
                  </div>
                </div>

                <div className="form-row">
                  <input type="text" name="permanentAddress" className="form-input" placeholder="Permanent Address" value={formDetails.permanentAddress} onChange={inputChange} required />
                  <input type="text" name="temporaryAddress" className="form-input" placeholder="Temporary Address" value={formDetails.temporaryAddress} onChange={inputChange} required />
                </div>

                <div className="form-section-title" style={{ marginTop: "1rem", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-secondary)" }}>Emergency Contact Details</div>
                <div className="form-row">
                  <input type="text" name="emergencyName" className="form-input" placeholder="Contact Person Name" value={formDetails.emergencyName} onChange={inputChange} required />
                  <input type="text" name="emergencyRelation" className="form-input" placeholder="Relation" value={formDetails.emergencyRelation} onChange={inputChange} required />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <input type="tel" name="emergencyPhone1" className="form-input" placeholder="Emergency Phone 1" value={formDetails.emergencyPhone1} onChange={inputChange} onBlur={handleBlur} required maxLength="10" inputMode="numeric" />
                    {renderError("emergencyPhone1")}
                  </div>
                  <div className="form-field">
                    <input type="tel" name="emergencyPhone2" className="form-input" placeholder="Emergency Phone 2 (Optional)" value={formDetails.emergencyPhone2} onChange={inputChange} onBlur={handleBlur} maxLength="10" inputMode="numeric" />
                    {renderError("emergencyPhone2")}
                  </div>
                </div>
              </>
            )}

            {selectedRole === "Doctor" && (
              <>
                <div className="form-row">
                  <input type="text" name="specialization" className="form-input" placeholder="Specialization" value={formDetails.specialization} onChange={inputChange} required />
                  <input type="number" name="experience" className="form-input" placeholder="Experience (years)" value={formDetails.experience} onChange={inputChange} required />
                </div>
                <div className="form-row">
                  <input type="number" name="fees" className="form-input" placeholder="Consultation Fees" value={formDetails.fees} onChange={inputChange} required />
                  <input type="text" name="qualifications" className="form-input" placeholder="Qualifications/Degree" value={formDetails.qualifications} onChange={inputChange} required />
                </div>
                <div className="form-row">
                  <input type="text" name="hospitalName" className="form-input" placeholder="Hospital/Clinic Name" value={formDetails.hospitalName} onChange={inputChange} required />
                  <div className="file-input-wrapper" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Qualification Certificate (Degree/License)</label>
                    <input type="file" onChange={(e) => onUpload(e.target.files[0], "cert")} name="certificate" className="form-input file-input" required={selectedRole === "Doctor"} />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {getSubmitText()}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link className="auth-link" href="/login">Log in</Link>
          </p>
        </div>
      </section>
    </>
  );
}

const PublicRegister = () => <Public><Register /></Public>;

export default PublicRegister;
