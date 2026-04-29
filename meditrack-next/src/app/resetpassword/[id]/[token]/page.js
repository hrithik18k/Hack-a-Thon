"use client";

import { Public } from "../../../../middleware/route";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import toast from "react-hot-toast";

axios.defaults.baseURL = getApiBaseUrl();

function ResetPassword() {
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      return toast.error("Password is required");
    }

    try {
      const response = await axios.post(`/api/user/resetpassword/${id}/${token}`, { password });

      if (response.data.success) {
        toast.success(response.data.message || "Password reset successfully");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section flex-center">
      <div className="register-container flex-center">
          <h2 className="form-heading">Reset Password</h2>
          <form onSubmit={handleFormSubmit} className="register-form">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your new password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button type="submit" className="btn form-btn">
              Reset Password
            </button>
          </form>
          <Link className="login-link" href="/login">
            Back to Login
          </Link>
        </div>
      </section>
    </>
  );
}

const PublicResetPassword = () => <Public><ResetPassword /></Public>;

export default PublicResetPassword;
