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
import { FiCamera } from "react-icons/fi";

axios.defaults.baseURL = getApiBaseUrl();
axios.defaults.withCredentials = true;

function Profile() {
  const { ready, user } = useAuthSession();
  const userId = user?._id;

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    city: "",
    gender: "male",
    dateOfBirth: "",
    bloodGroup: "",
    emergencyContact: { name: "", relation: "", phone1: "", phone2: "" },
  });

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const data = await fetchData(`/api/user/getuser/${userId}`);
        setFormDetails({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          gender: data.gender || "male",
          bloodGroup: data.bloodGroup || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
          emergencyContact: data.emergencyContact || { name: "", relation: "", phone1: "", phone2: "" },
        });
        setFile(data.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
      } finally {
        setLoading(false);
      }
    }

    if (ready && userId) {
      getUser();
    }
  }, [ready, userId]);

  const inputChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("em_")) {
      const field = name.split("_")[1];
      const formattedValue = field === "phone1" || field === "phone2" ? value.replace(/\D/g, "").slice(0, 10) : value;
      setFormDetails((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: formattedValue },
      }));
      return;
    }

    if (name === "phone") {
      setFormDetails((prev) => ({ ...prev, phone: value.replace(/\D/g, "").slice(0, 10) }));
      return;
    }

    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const onUpload = async (element) => {
    if (!element) {
      return;
    }

    setPicLoading(true);
    if (element.type === "image/jpeg" || element.type === "image/png" || element.type === "image/jpg") {
      const data = new FormData();
      data.append("file", element);
      data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
      data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL, {
          method: "POST",
          body: data,
        });
        const uploadData = await response.json();
        setFile(uploadData.url.toString());
        toast.success("Photo uploaded. Save your profile to keep the change.");
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setPicLoading(false);
      }
    } else {
      setPicLoading(false);
      toast.error("Please select a JPEG or PNG image");
    }
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!formDetails.email) {
        toast.error("Email should not be empty");
        return;
      }

      const { data } = await axios.put("/api/user/updateprofile", { ...formDetails, pic: file });
      if (data.success) {
        toast.success("Profile updated successfully");
      }
    } catch {
      toast.error("Unable to update profile");
    }
  };

  return (
    <EditorialShell>
      <main className="editorial-page">
        <section className="editorial-page-hero">
          <div className="editorial-shell editorial-narrow-shell">
            <span className="editorial-eyebrow">Account profile</span>
            <h1 className="editorial-page-title">Personal details and emergency contacts in one refined form.</h1>
            <p className="editorial-lede">
              Update your identity, care basics, and emergency details without leaving the same healthcare layout.
            </p>
          </div>
        </section>

        <section className="editorial-section editorial-section-tight">
          <div className="editorial-shell editorial-narrow-shell">
            {!ready || loading ? (
              <Loading label="Loading your profile..." />
            ) : (
              <div className="editorial-form-card">
                <div className="editorial-profile-avatar-row">
                  <label htmlFor="profile-upload" className="editorial-avatar-upload">
                    <img src={file} alt="Profile" className="profile-pic" style={{ opacity: picLoading ? 0.55 : 1 }} />
                    <span><FiCamera /> {picLoading ? "Uploading..." : "Change photo"}</span>
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(event) => onUpload(event.target.files[0])}
                    accept="image/jpeg, image/png, image/jpg"
                  />
                </div>

                <form onSubmit={formSubmit} className="editorial-stack">
                  <div className="editorial-form-grid">
                    <div className="form-field">
                      <label className="editorial-label">First name</label>
                      <input type="text" name="firstname" className="editorial-input" value={formDetails.firstname} onChange={inputChange} required />
                    </div>
                    <div className="form-field">
                      <label className="editorial-label">Last name</label>
                      <input type="text" name="lastname" className="editorial-input" value={formDetails.lastname} onChange={inputChange} required />
                    </div>
                    <div className="form-field">
                      <label className="editorial-label">Email</label>
                      <input type="email" className="editorial-input" value={formDetails.email} disabled />
                    </div>
                    <div className="form-field">
                      <label className="editorial-label">Phone</label>
                      <input type="text" name="phone" className="editorial-input" value={formDetails.phone} onChange={inputChange} maxLength="10" inputMode="numeric" />
                    </div>
                    <div className="form-field">
                      <label className="editorial-label">City</label>
                      <input type="text" name="city" className="editorial-input" value={formDetails.city} onChange={inputChange} />
                    </div>
                    <div className="form-field">
                      <label className="editorial-label">Gender</label>
                      <select name="gender" className="editorial-input" value={formDetails.gender} onChange={inputChange}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="editorial-label">Date of birth</label>
                      <input type="date" name="dateOfBirth" className="editorial-input" value={formDetails.dateOfBirth} onChange={inputChange} />
                    </div>
                    <div className="form-field">
                      <label className="editorial-label">Blood group</label>
                      <select name="bloodGroup" className="editorial-input" value={formDetails.bloodGroup} onChange={inputChange}>
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div className="editorial-subsection">
                    <h2 className="editorial-form-section-title">Emergency contact</h2>
                    <div className="editorial-form-grid">
                      <div className="form-field">
                        <label className="editorial-label">Contact name</label>
                        <input type="text" name="em_name" className="editorial-input" value={formDetails.emergencyContact.name} onChange={inputChange} />
                      </div>
                      <div className="form-field">
                        <label className="editorial-label">Relation</label>
                        <input type="text" name="em_relation" className="editorial-input" value={formDetails.emergencyContact.relation} onChange={inputChange} />
                      </div>
                      <div className="form-field">
                        <label className="editorial-label">Primary phone</label>
                        <input type="text" name="em_phone1" className="editorial-input" value={formDetails.emergencyContact.phone1} onChange={inputChange} maxLength="10" inputMode="numeric" />
                      </div>
                      <div className="form-field">
                        <label className="editorial-label">Secondary phone</label>
                        <input type="text" name="em_phone2" className="editorial-input" value={formDetails.emergencyContact.phone2} onChange={inputChange} maxLength="10" inputMode="numeric" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="editorial-btn editorial-btn-primary editorial-btn-block">Save profile updates</button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
    </EditorialShell>
  );
}

const ProtectedProfile = () => <Protected><Profile /></Protected>;

export default ProtectedProfile;
