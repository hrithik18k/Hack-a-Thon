import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Profile() {
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    const decoded = jwt_decode(token);
    userId = decoded.userId;
  }

  const [loading, setLoading]               = useState(true);
  const [file, setFile]                     = useState("");
  const [picLoading, setPicLoading]         = useState(false);

  const [formDetails, setFormDetails] = useState({
    firstname: "", lastname: "", email: "", phone: "", city: "", gender: "male", dateOfBirth: "", bloodGroup: "",
    emergencyContact: { name: "", relation: "", phone1: "", phone2: "" },
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
          bloodGroup: temp.bloodGroup || "",
          dateOfBirth: temp.dateOfBirth ? temp.dateOfBirth.split("T")[0] : "",
          emergencyContact: temp.emergencyContact || { name: "", relation: "", phone1: "", phone2: "" },
        });
        setFile(temp.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("em_")) {
      const field = name.split("_")[1];
      let formattedValue = value;
      if (field === "phone1" || field === "phone2") {
        formattedValue = value.replace(/\D/g, "").slice(0, 10);
      }
      setFormDetails({
        ...formDetails,
        emergencyContact: { ...formDetails.emergencyContact, [field]: formattedValue }
      });
    } else if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormDetails({ ...formDetails, [name]: numericValue });
    } else {
      setFormDetails({ ...formDetails, [name]: value });
    }
  };

  const onUpload = async (element) => {
    setPicLoading(true);
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
        toast.success("Image uploaded! Don't forget to 'Update Profile'");
      } catch (err) {
        toast.error("Failed to upload image");
      } finally {
        setPicLoading(false);
      }
    } else {
      setPicLoading(false);
      toast.error("Please select an image (jpeg/png/jpg)");
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formDetails.email) return toast.error("Email should not be empty");
      const { data } = await axios.put("/api/user/updateprofile", { ...formDetails, pic: file }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Unable to update profile");
    }
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

            <div className="flex-center" style={{ marginBottom: "2rem", position: "relative" }}>
              <label htmlFor="profile-upload" style={{ cursor: "pointer", position: "relative" }}>
                <img src={file} alt="profile" className="profile-pic" style={{ opacity: picLoading ? 0.5 : 1 }} />
                {picLoading && (
                  <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "0.8rem", fontWeight: "bold" }}>
                    Uploading...
                  </span>
                )}
                <div style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--accent-primary)", fontWeight: "500" }}>Change Picture</div>
              </label>
              <input 
                id="profile-upload" 
                type="file" 
                style={{ display: "none" }} 
                onChange={(e) => onUpload(e.target.files[0])} 
                accept="image/jpeg, image/png, image/jpg"
              />
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
              <div className="form-group-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" className="form-input" value={formDetails.dateOfBirth} onChange={inputChange} />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select name="bloodGroup" className="form-input" value={formDetails.bloodGroup} onChange={inputChange}>
                    <option value="">Select</option>
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
              </div>

              <div className="auth-header" style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
                <h3 className="auth-title" style={{ fontSize: "1.2rem" }}>Emergency Contact (Optional)</h3>
              </div>
              
              <div className="form-group-row">
                <div className="form-group">
                  <label>Contact Name</label>
                  <input type="text" name="em_name" className="form-input" value={formDetails.emergencyContact.name} onChange={inputChange} />
                </div>
                <div className="form-group">
                  <label>Relation</label>
                  <input type="text" name="em_relation" className="form-input" value={formDetails.emergencyContact.relation} onChange={inputChange} />
                </div>
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Primary Phone</label>
                  <input type="text" name="em_phone1" className="form-input" value={formDetails.emergencyContact.phone1} onChange={inputChange} maxLength="10" inputMode="numeric" />
                </div>
                <div className="form-group">
                  <label>Secondary Phone</label>
                  <input type="text" name="em_phone2" className="form-input" value={formDetails.emergencyContact.phone2} onChange={inputChange} maxLength="10" inputMode="numeric" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: "1rem" }}>Update Profile</button>
            </form>


          </div>
        </section>
      )}
      <Footer />

    </>
  );
}



export default Profile;