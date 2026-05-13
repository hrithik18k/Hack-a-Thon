"use client";

import { Public } from "../../middleware/route";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";

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
    <main className="editorial-auth-page">
      <section className="editorial-auth-shell editorial-auth-shell-register">
        <aside className="editorial-auth-aside">
          <span className="editorial-eyebrow editorial-eyebrow-invert">Open your file</span>
          <h1 className="editorial-section-title editorial-section-title-invert">
            Registration now matches the rest of the redesigned care journey.
          </h1>
          <p className="editorial-lede editorial-lede-invert">
            Patients can add emergency details and doctors can apply with credentials without leaving the same streamlined form language.
          </p>
        </aside>

        <section className="editorial-auth-panel editorial-auth-panel-wide">
          <span className="editorial-eyebrow">Registration</span>
          <h2 className="editorial-auth-title">Create an account</h2>

          <div className="editorial-role-picker">
            <button
              type="button"
              className={`editorial-role-button ${selectedRole === "Patient" ? "is-active" : ""}`}
              onClick={() => setSelectedRole("Patient")}
            >
              Patient
            </button>
            <button
              type="button"
              className={`editorial-role-button ${selectedRole === "Doctor" ? "is-active" : ""}`}
              onClick={() => setSelectedRole("Doctor")}
            >
              Doctor
            </button>
          </div>

          <form onSubmit={formSubmit} className="editorial-auth-form editorial-auth-form-wide">
            <div className="form-row">
              <div className="form-field">
                <label className="editorial-label" htmlFor="firstname">First name</label>
                <input id="firstname" type="text" name="firstname" className="editorial-input" placeholder="First name" value={formDetails.firstname} onChange={inputChange} onBlur={handleBlur} required />
                {renderError("firstname")}
              </div>
              <div className="form-field">
                <label className="editorial-label" htmlFor="lastname">Last name</label>
                <input id="lastname" type="text" name="lastname" className="editorial-input" placeholder="Last name" value={formDetails.lastname} onChange={inputChange} onBlur={handleBlur} required />
                {renderError("lastname")}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="editorial-label" htmlFor="register-email">Email</label>
                <input id="register-email" type="email" name="email" className="editorial-input" placeholder="Email address" value={formDetails.email} onChange={inputChange} onBlur={handleBlur} required />
                {renderError("email")}
              </div>
              <div className="form-field">
                <label className="editorial-label" htmlFor="phone">Phone</label>
                <input id="phone" type="tel" name="phone" className="editorial-input" placeholder="Phone number" value={formDetails.phone} onChange={inputChange} onBlur={handleBlur} required maxLength="10" inputMode="numeric" />
                {renderError("phone")}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="editorial-label" htmlFor="register-password">Password</label>
                <input id="register-password" type="password" name="password" className="editorial-input" placeholder="Password" value={formDetails.password} onChange={inputChange} onBlur={handleBlur} required />
                {renderError("password")}
              </div>
              <div className="form-field">
                <label className="editorial-label" htmlFor="confirm-password">Confirm password</label>
                <input id="confirm-password" type="password" name="confpassword" className="editorial-input" placeholder="Confirm password" value={formDetails.confpassword} onChange={inputChange} onBlur={handleBlur} required />
                {renderError("confpassword")}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="editorial-label" htmlFor="city">City</label>
                <input id="city" type="text" name="city" className="editorial-input" placeholder="City" value={formDetails.city} onChange={inputChange} required />
              </div>
              <div className="file-input-wrapper" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label className="editorial-label">Profile picture</label>
                <input type="file" onChange={(e) => onUpload(e.target.files[0], "profile")} name="profile-pic" className="editorial-input" />
              </div>
            </div>

            {selectedRole === "Patient" && (
              <>
                <div className="form-row">
                  <div className="form-field" style={{ position: "relative" }}>
                    <label className="editorial-label" htmlFor="dateOfBirth">Date of birth</label>
                    <input id="dateOfBirth" type="date" name="dateOfBirth" className="editorial-input" value={formDetails.dateOfBirth} onChange={inputChange} required title="Date of Birth" />
                  </div>
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="gender">Gender</label>
                    <select id="gender" name="gender" className="editorial-input" value={formDetails.gender} onChange={inputChange} required>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="bloodGroup">Blood group</label>
                    <select id="bloodGroup" name="bloodGroup" className="editorial-input" value={formDetails.bloodGroup} onChange={inputChange} required>
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
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="permanentAddress">Permanent address</label>
                    <input id="permanentAddress" type="text" name="permanentAddress" className="editorial-input" placeholder="Permanent address" value={formDetails.permanentAddress} onChange={inputChange} required />
                  </div>
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="temporaryAddress">Temporary address</label>
                    <input id="temporaryAddress" type="text" name="temporaryAddress" className="editorial-input" placeholder="Temporary address" value={formDetails.temporaryAddress} onChange={inputChange} required />
                  </div>
                </div>

                <div className="editorial-form-section-title">Emergency contact details</div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="emergencyName">Contact name</label>
                    <input id="emergencyName" type="text" name="emergencyName" className="editorial-input" placeholder="Contact person name" value={formDetails.emergencyName} onChange={inputChange} required />
                  </div>
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="emergencyRelation">Relation</label>
                    <input id="emergencyRelation" type="text" name="emergencyRelation" className="editorial-input" placeholder="Relation" value={formDetails.emergencyRelation} onChange={inputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="emergencyPhone1">Emergency phone 1</label>
                    <input id="emergencyPhone1" type="tel" name="emergencyPhone1" className="editorial-input" placeholder="Emergency phone 1" value={formDetails.emergencyPhone1} onChange={inputChange} onBlur={handleBlur} required maxLength="10" inputMode="numeric" />
                    {renderError("emergencyPhone1")}
                  </div>
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="emergencyPhone2">Emergency phone 2</label>
                    <input id="emergencyPhone2" type="tel" name="emergencyPhone2" className="editorial-input" placeholder="Emergency phone 2 (optional)" value={formDetails.emergencyPhone2} onChange={inputChange} onBlur={handleBlur} maxLength="10" inputMode="numeric" />
                    {renderError("emergencyPhone2")}
                  </div>
                </div>
              </>
            )}

            {selectedRole === "Doctor" && (
              <>
                <div className="form-row">
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="specialization">Specialization</label>
                    <input id="specialization" type="text" name="specialization" className="editorial-input" placeholder="Specialization" value={formDetails.specialization} onChange={inputChange} required />
                  </div>
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="experience">Experience</label>
                    <input id="experience" type="number" name="experience" className="editorial-input" placeholder="Experience (years)" value={formDetails.experience} onChange={inputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="fees">Consultation fee</label>
                    <input id="fees" type="number" name="fees" className="editorial-input" placeholder="Consultation fees" value={formDetails.fees} onChange={inputChange} required />
                  </div>
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="qualifications">Qualifications</label>
                    <input id="qualifications" type="text" name="qualifications" className="editorial-input" placeholder="Qualifications or degree" value={formDetails.qualifications} onChange={inputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="editorial-label" htmlFor="hospitalName">Hospital or clinic</label>
                    <input id="hospitalName" type="text" name="hospitalName" className="editorial-input" placeholder="Hospital or clinic name" value={formDetails.hospitalName} onChange={inputChange} required />
                  </div>
                  <div className="file-input-wrapper" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label className="editorial-label">Qualification certificate</label>
                    <input type="file" onChange={(e) => onUpload(e.target.files[0], "cert")} name="certificate" className="editorial-input" required={selectedRole === "Doctor"} />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="editorial-btn editorial-btn-primary editorial-btn-block" disabled={loading}>
              <span>{getSubmitText()}</span>
              {!loading ? <FiArrowRight /> : null}
            </button>
          </form>

          <p className="editorial-auth-links">
            <span>Already have an account? <Link href="/login">Log in</Link></span>
          </p>
        </section>
      </section>
    </main>
  );
}

const PublicRegister = () => <Public><Register /></Public>;

export default PublicRegister;
