import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function ForgotPassword() {
  const [formDetails, setFormDetails] = useState({
    email: "",
  });
  const navigate = useNavigate(); 

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const { email } = formDetails;

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      const response = await axios.post("/api/user/forgotpassword", { email });
      if (response.data.success) {
        toast.success(response.data.message || "Password reset email sent successfully!");
        navigate('/login'); 
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send password reset email");
      }
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section flex-center">
        <div className="register-container flex-center">
          <h2 className="form-heading">Forgot Password</h2>
          <form onSubmit={formSubmit} className="register-form">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formDetails.email}
              onChange={inputChange}
            />
            <button type="submit" className="btn form-btn">
              Send Reset Email
            </button>
          </form>
          <NavLink className="login-link" to={"/login"}>
            Back to Login
          </NavLink>
        </div>
      </section>
    </>
  );
}

export default ForgotPassword;