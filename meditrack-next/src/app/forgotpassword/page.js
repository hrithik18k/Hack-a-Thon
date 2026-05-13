"use client";

import { Public } from "../../middleware/route";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import toast from "react-hot-toast";
import { FiArrowRight, FiMail } from "react-icons/fi";

axios.defaults.baseURL = getApiBaseUrl();

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/user/forgotpassword", { email });
      if (response.data.success) {
        toast.success(response.data.message || "Password reset email sent successfully");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="editorial-auth-page">
      <section className="editorial-auth-shell">
        <aside className="editorial-auth-aside">
          <span className="editorial-eyebrow editorial-eyebrow-invert">Account recovery</span>
          <h1 className="editorial-section-title editorial-section-title-invert">Recover access without losing the calm, guided care experience.</h1>
          <p className="editorial-lede editorial-lede-invert">
            We will send a secure reset link to the email address associated with your account.
          </p>
        </aside>

        <section className="editorial-auth-panel">
          <span className="editorial-eyebrow">Reset password</span>
          <h2 className="editorial-auth-title">Request a password reset</h2>

          <form onSubmit={formSubmit} className="editorial-auth-form">
            <div className="form-field">
              <label className="editorial-label" htmlFor="forgot-email">Email</label>
              <div className="editorial-input-wrap">
                <FiMail />
                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  className="editorial-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="editorial-btn editorial-btn-primary editorial-btn-block" disabled={loading}>
              <span>{loading ? "Sending..." : "Send reset link"}</span>
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

const PublicForgotPassword = () => <Public><ForgotPassword /></Public>;

export default PublicForgotPassword;
