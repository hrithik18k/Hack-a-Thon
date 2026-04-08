import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdAdminPanelSettings, MdArrowBack } from "react-icons/md";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import jwt_decode from "jwt-decode";
import fetchData from "../helper/apiCall";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
    role: "Patient", // Default to Patient
  });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getFieldError = (name, value) => {
    switch (name) {
      case "email": {
        if (!value) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Enter a valid email address";
        return "";
      }
      case "password":
        if (!value) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  const renderError = (fieldName) => {
    if (!touched[fieldName]) return null;
    const error = getFieldError(fieldName, formDetails[fieldName]);
    if (!error) return null;
    return <span className="field-error">{error}</span>;
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Check for errors
    const emailErr = getFieldError("email", formDetails.email);
    const passErr = getFieldError("password", formDetails.password);
    if (emailErr || passErr) {
      if (emailErr) toast.error(emailErr);
      else if (passErr) toast.error(passErr);
      return;
    }

    try {
      setLoading(true);
      const { email, password, role } = formDetails;

      const response = await axios.post("/api/user/login", { email, password, role });
      
      if (response.data.success) {
        toast.success("Login successful!");
        const { token } = response.data.data;
        localStorage.setItem("token", token);
        const decoded = jwt_decode(token);
        dispatch(setUserInfo(decoded.userId));
        await getUser(decoded.userId, role);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (id, role) => {
    try {
      const temp = await fetchData(`/api/user/getuser/${id}`);
      dispatch(setUserInfo(temp));
      if (role === "Admin") return navigate("/dashboard/home");
      return navigate("/");
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  return (
    <>
      <Navbar />
      <section className="auth-section">
        <button 
          type="button" 
          className="admin-login-corner-btn"
          onClick={() => setFormDetails({...formDetails, role: formDetails.role === "Admin" ? "Patient" : "Admin"})}
        >
          {formDetails.role === "Admin" ? (
            <><MdArrowBack /> Back to Login</>
          ) : (
            <><MdAdminPanelSettings /> Admin Login</>
          )}
        </button>

        <div className="auth-container">
          <h2 className="auth-heading">
            {formDetails.role === "Admin" ? "Admin Login" : "Welcome Back"}
          </h2>
          
          {formDetails.role !== "Admin" && (
            <div className="role-selector">
              <button 
                type="button"
                className={`role-btn ${formDetails.role === "Patient" ? "active" : ""}`}
                onClick={() => setFormDetails({...formDetails, role: "Patient"})}
              >
                Patient
              </button>
              <button 
                type="button"
                className={`role-btn ${formDetails.role === "Doctor" ? "active" : ""}`}
                onClick={() => setFormDetails({...formDetails, role: "Doctor"})}
              >
                Doctor
              </button>
            </div>
          )}

          <form onSubmit={formSubmit} className="auth-form">
            <div className="form-field">
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Email Address"
                value={formDetails.email}
                onChange={inputChange}
                onBlur={handleBlur}
                required
              />
              {renderError("email")}
            </div>

            <div className="form-field">
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Password"
                value={formDetails.password}
                onChange={inputChange}
                onBlur={handleBlur}
                required
              />
              {renderError("password")}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-footer">
            <NavLink className="auth-link" to="/forgotpassword" style={{ display: "block", marginBottom: "0.5rem" }}>
              Forgot Password?
            </NavLink>
            Not a user? <NavLink className="auth-link" to="/register">Register</NavLink>
          </p>
        </div>
      </section>
    </>
  );
}

export default Login;
