import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Register() {
  const [file, setFile] = useState("");
  const [selectedRole, setSelectedRole] = useState("Patient");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    // Doctor specific fields:
    specialization: "",
    experience: "",
    fees: "",
    qualifications: "",
    hospitalName: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  const onUpload = async (element) => {
    setLoading(true);
    if (element.type === "image/jpeg" || element.type === "image/png" || element.type === "image/jpg") {
      const data = new FormData();
      data.append("file", element);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

      try {
        const res = await fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL, {
          method: "POST",
          body: data,
        });
        const uploadData = await res.json();
        setFile(uploadData.url.toString());
        toast.success("Profile picture uploaded successfully");
      } catch (err) {
        toast.error("Failed to upload image");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.error("Please select an image in jpeg or png format");
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (formDetails.password !== formDetails.confpassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = { ...formDetails, pic: file, role: selectedRole };
      
      const response = await axios.post("/api/user/register", payload);
      
      if (response.data.success) {
        toast.success(response.data.message || "User registered successfully!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    }
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
              <input type="text" name="firstname" className="form-input" placeholder="First Name" value={formDetails.firstname} onChange={inputChange} required />
              <input type="text" name="lastname" className="form-input" placeholder="Last Name" value={formDetails.lastname} onChange={inputChange} required />
            </div>

            <div className="form-row">
              <input type="email" name="email" className="form-input" placeholder="Email Address" value={formDetails.email} onChange={inputChange} required />
              <input type="tel" name="phone" className="form-input" placeholder="Phone Number" value={formDetails.phone} onChange={inputChange} required />
            </div>

            <div className="form-row">
              <input type="password" name="password" className="form-input" placeholder="Password" value={formDetails.password} onChange={inputChange} required />
              <input type="password" name="confpassword" className="form-input" placeholder="Confirm Password" value={formDetails.confpassword} onChange={inputChange} required />
            </div>

            <div className="form-row">
              <input type="text" name="city" className="form-input" placeholder="City" value={formDetails.city} onChange={inputChange} required />
              <div className="file-input-wrapper">
                <input type="file" onChange={(e) => onUpload(e.target.files[0])} name="profile-pic" className="form-input file-input" />
              </div>
            </div>

            {selectedRole === "Patient" && (
              <div className="form-row">
                <input type="date" name="dateOfBirth" className="form-input" value={formDetails.dateOfBirth} onChange={inputChange} required />
                <select name="gender" className="form-input" value={formDetails.gender} onChange={inputChange} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
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
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Processing..." : selectedRole === "Doctor" ? "Apply as Doctor" : "Register"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <NavLink className="auth-link" to="/login">Log in</NavLink>
          </p>
        </div>
      </section>
    </>
  );
}

export default Register;
