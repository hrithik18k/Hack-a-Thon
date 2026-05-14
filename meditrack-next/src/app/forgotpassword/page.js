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

function ForgotPassword() {
  const [formDetails, setFormDetails] = useState({
    email: "",
  });
  const router = useRouter();

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
        router.push("/login");
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
          <Link className="login-link" href={"/login"}>
            Back to Login
          </Link>
        </div>
      </section>
    </>
  );
}

const PublicForgotPassword = () => <Public><ForgotPassword /></Public>;

export default PublicForgotPassword;
