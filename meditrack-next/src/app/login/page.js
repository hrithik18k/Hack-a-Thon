"use client";

import { Public } from "../../middleware/route";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdAdminPanelSettings, MdArrowBack } from "react-icons/md";
import Navbar from "../../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/reducers/rootSlice";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";
axios.defaults.withCredentials = true;

function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

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
        const { user } = response.data.data;
        dispatch(setUserInfo(user));
        if (role === "Admin") return router.push("/dashboard/home");
        return router.push("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
            <Link className="auth-link" href="/forgotpassword" style={{ display: "block", marginBottom: "0.5rem" }}>
              Forgot Password?
            </Link>
            Not a user? <Link className="auth-link" href="/register">Register</Link>
          </p>
        </div>
      </section>
    </>
  );
}

const PublicLogin = () => <Public><Login /></Public>;

export default PublicLogin;
