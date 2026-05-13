"use client";

import { Public } from "../../middleware/route";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdAdminPanelSettings, MdArrowBack } from "react-icons/md";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/reducers/rootSlice";
import { FiArrowRight } from "react-icons/fi";

axios.defaults.baseURL = getApiBaseUrl();
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
    <main className="editorial-auth-page">
      <section className="editorial-auth-shell">
        <aside className="editorial-auth-aside">
          <span className="editorial-eyebrow editorial-eyebrow-invert">Secure access</span>
          <h1 className="editorial-section-title editorial-section-title-invert">
            Sign into the same system that powers booking, records, and emergency lookup.
          </h1>
          <p className="editorial-lede editorial-lede-invert">
            Patient, doctor, and admin access stay distinct, but the new UI keeps them in one coherent entry flow.
          </p>
        </aside>

        <section className="editorial-auth-panel">
          <button
            type="button"
            className="editorial-toggle-link"
            onClick={() => setFormDetails({ ...formDetails, role: formDetails.role === "Admin" ? "Patient" : "Admin" })}
          >
            {formDetails.role === "Admin" ? (
              <>
                <MdArrowBack />
                <span>Back to standard sign in</span>
              </>
            ) : (
              <>
                <MdAdminPanelSettings />
                <span>Switch to admin login</span>
              </>
            )}
          </button>

          <span className="editorial-eyebrow">Account access</span>
          <h2 className="editorial-auth-title">{formDetails.role === "Admin" ? "Admin sign in" : "Welcome back"}</h2>

          {formDetails.role !== "Admin" && (
            <div className="editorial-role-picker">
              <button
                type="button"
                className={`editorial-role-button ${formDetails.role === "Patient" ? "is-active" : ""}`}
                onClick={() => setFormDetails({ ...formDetails, role: "Patient" })}
              >
                Patient
              </button>
              <button
                type="button"
                className={`editorial-role-button ${formDetails.role === "Doctor" ? "is-active" : ""}`}
                onClick={() => setFormDetails({ ...formDetails, role: "Doctor" })}
              >
                Doctor
              </button>
            </div>
          )}

          <form onSubmit={formSubmit} className="editorial-auth-form">
            <div className="form-field">
              <label className="editorial-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                className="editorial-input"
                placeholder="you@example.com"
                value={formDetails.email}
                onChange={inputChange}
                onBlur={handleBlur}
                required
              />
              {renderError("email")}
            </div>

            <div className="form-field">
              <label className="editorial-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                className="editorial-input"
                placeholder="Enter your password"
                value={formDetails.password}
                onChange={inputChange}
                onBlur={handleBlur}
                required
              />
              {renderError("password")}
            </div>

            <button type="submit" className="editorial-btn editorial-btn-primary editorial-btn-block" disabled={loading}>
              <span>{loading ? "Signing in..." : "Sign in"}</span>
              {!loading ? <FiArrowRight /> : null}
            </button>
          </form>

          <p className="editorial-auth-links">
            <Link href="/forgotpassword">Forgot password?</Link>
            <span>New here? <Link href="/register">Create an account</Link></span>
          </p>
        </section>
      </section>
    </main>
  );
}

const PublicLogin = () => <Public><Login /></Public>;

export default PublicLogin;
