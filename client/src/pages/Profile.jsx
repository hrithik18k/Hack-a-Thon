import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
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
  
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    city: "",
    gender: "male",
    dateOfBirth: "",
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
          dateOfBirth: temp.dateOfBirth ? temp.dateOfBirth.split('T')[0] : "",
        });
        setFile(temp.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) getUser();
  }, [userId]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formDetails.email) return toast.error("Email should not be empty");
      if (formDetails.firstname.length < 2) return toast.error("First name must be at least 2 characters");

      const { data } = await axios.put(
        "/api/user/updateprofile",
        formDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update profile");
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="auth-section">
          <div className="auth-container" style={{ maxWidth: '600px' }}>
            <div className="auth-header">
              <h2 className="auth-title">My Profile</h2>
              <p className="auth-subtitle">Update your personal information</p>
            </div>
            
            <div className="flex-center" style={{ marginBottom: '2rem' }}>
              <img
                src={file}
                alt="profile"
                className="profile-pic"
              />
            </div>

            <form onSubmit={formSubmit} className="auth-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="firstname">First Name</label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    className="form-input"
                    value={formDetails.firstname}
                    onChange={inputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    className="form-input"
                    value={formDetails.lastname}
                    onChange={inputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formDetails.email}
                    onChange={inputChange}
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-input"
                    value={formDetails.phone}
                    onChange={inputChange}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="form-input"
                    value={formDetails.city}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-input"
                    value={formDetails.gender}
                    onChange={inputChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className="form-input"
                  value={formDetails.dateOfBirth}
                  onChange={inputChange}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
                Update Profile
              </button>
              
              <button 
                type="button" 
                className="btn btn-secondary-outline btn-full" 
                style={{ marginTop: '1rem', borderStyle: 'dashed' }}
                onClick={() => toast("Feature coming soon 🚀", { icon: "👆" })}
              >
                Update your fingerprints
              </button>
            </form>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}

export default Profile;
