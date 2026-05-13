"use client";

import { Protected } from "../../middleware/route";
import React, { useEffect, useState } from "react";
import axios from "axios";
import EditorialShell from "../../components/editorial/EditorialShell";
import Loading from "../../components/Loading";
import fetchData from "../../helper/apiCall";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { useAuthSession } from "@/lib/useAuthSession";
import toast from "react-hot-toast";

axios.defaults.baseURL = getApiBaseUrl();
axios.defaults.withCredentials = true;

function ChangePassword() {
  const { ready, user } = useAuthSession();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    password: "",
    newpassword: "",
    confnewpassword: "",
  });

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const data = await fetchData(`/api/user/getuser/${user?._id}`);
        setFile(data.pic);
      } finally {
        setLoading(false);
      }
    }

    if (ready && user?._id) {
      getUser();
    }
  }, [ready, user]);

  const inputChange = (event) => {
    const { name, value } = event.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    const { password, newpassword, confnewpassword } = formDetails;

    if (newpassword !== confnewpassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.put("/api/user/changepassword", {
        currentPassword: password,
        newPassword: newpassword,
        confirmNewPassword: confnewpassword,
      });

      if (response.data.success || response.data === "Password changed successfully") {
        toast.success("Password updated successfully");
        setFormDetails({ password: "", newpassword: "", confnewpassword: "" });
      } else {
        toast.error("Unable to update password");
      }
    } catch (error) {
      toast.error(error.response?.data || "Network error. Please try again.");
    }
  };

  return (
    <EditorialShell>
      <main className="editorial-page">
        <section className="editorial-page-hero">
          <div className="editorial-shell editorial-narrow-shell">
            <span className="editorial-eyebrow">Security settings</span>
            <h1 className="editorial-page-title">Change your password with the same secure medical account flow.</h1>
            <p className="editorial-lede">
              Keep your profile protected while staying inside the refined care interface.
            </p>
          </div>
        </section>

        <section className="editorial-section editorial-section-tight">
          <div className="editorial-shell editorial-narrow-shell">
            {!ready || loading ? (
              <Loading label="Loading security settings..." />
            ) : (
              <div className="editorial-form-card">
                <div className="editorial-profile-avatar-row">
                  <img src={file} alt="Profile" className="profile-pic" />
                </div>

                <form onSubmit={formSubmit} className="editorial-stack">
                  <div className="form-field">
                    <label className="editorial-label">Current password</label>
                    <input type="password" name="password" className="editorial-input" placeholder="Enter your current password" value={formDetails.password} onChange={inputChange} />
                  </div>
                  <div className="editorial-form-grid">
                    <div className="form-field">
                      <label className="editorial-label">New password</label>
                      <input type="password" name="newpassword" className="editorial-input" placeholder="Enter your new password" value={formDetails.newpassword} onChange={inputChange} />
                    </div>
                    <div className="form-field">
                      <label className="editorial-label">Confirm new password</label>
                      <input type="password" name="confnewpassword" className="editorial-input" placeholder="Confirm your new password" value={formDetails.confnewpassword} onChange={inputChange} />
                    </div>
                  </div>
                  <button type="submit" className="editorial-btn editorial-btn-primary editorial-btn-block">Update password</button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
    </EditorialShell>
  );
}

const ProtectedChangePassword = () => <Protected><ChangePassword /></Protected>;

export default ProtectedChangePassword;
