"use client";

import { Public } from "../../../../middleware/route";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import toast from "react-hot-toast";
import { FiArrowRight, FiLock } from "react-icons/fi";

axios.defaults.baseURL = getApiBaseUrl();

function ResetPassword() {
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/user/resetpassword/${id}/${token}`, { password });
      if (response.data.success) {
        toast.success(response.data.message || "Password reset successfully");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="editorial-auth-page">
      <section className="editorial-auth-shell">
        <aside className="editorial-auth-aside">
          <span className="editorial-eyebrow editorial-eyebrow-invert">New password</span>
          <h1 className="editorial-section-title editorial-section-title-invert">Create a new password and return to your care dashboard.</h1>
          <p className="editorial-lede editorial-lede-invert">
            This link keeps the recovery flow secure while staying aligned with the rest of the app experience.
          </p>
        </aside>

        <section className="editorial-auth-panel">
          <span className="editorial-eyebrow">Complete reset</span>
          <h2 className="editorial-auth-title">Set your new password</h2>

          <form onSubmit={handleFormSubmit} className="editorial-auth-form">
            <div className="form-field">
              <label className="editorial-label" htmlFor="reset-password">New password</label>
              <div className="editorial-input-wrap">
                <FiLock />
                <input
                  id="reset-password"
                  type="password"
                  name="password"
                  className="editorial-input"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="editorial-btn editorial-btn-primary editorial-btn-block" disabled={loading}>
              <span>{loading ? "Resetting..." : "Reset password"}</span>
              {!loading ? <FiArrowRight /> : null}
            </button>
          </form>

          <p className="editorial-auth-links">
            <Link href="/login">Back to sign in</Link>
          </p>
        </section>
      </section>
    </main>
  );
}

const PublicResetPassword = () => <Public><ResetPassword /></Public>;

export default PublicResetPassword;
