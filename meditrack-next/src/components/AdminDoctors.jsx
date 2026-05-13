"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import fetchData from "../helper/apiCall";
import Empty from "./Empty";
import Loading from "./Loading";
import toast from "react-hot-toast";

axios.defaults.baseURL = getApiBaseUrl();

const statusBadge = (status) => {
  switch (status) {
    case "Approved":
      return "badge-success";
    case "Pending":
      return "badge-warning";
    case "Rejected":
      return "badge-danger";
    default:
      return "";
  }
};

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllDoctors = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes] = await Promise.all([
        fetchData("/api/doctor/getnotdoctors"),
        fetchData("/api/doctor/getalldoctors"),
      ]);
      setDoctors([...(pendingRes || []), ...(approvedRes || [])]);
    } catch {
      toast.error("Unable to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  const handleAction = async (userId, action) => {
    try {
      const endpoint = action === "Approve" ? "/api/doctor/acceptdoctor" : "/api/doctor/rejectdoctor";
      if (!window.confirm(`Confirm ${action.toLowerCase()} for this doctor?`)) {
        return;
      }

      const { data } = await axios.put(endpoint, { userId });
      if (data.success) {
        toast.success(data.message || `Doctor ${action.toLowerCase()}d`);
        getAllDoctors();
      }
    } catch {
      toast.error(`Unable to ${action.toLowerCase()} doctor`);
    }
  };

  const deleteDoctor = async (userId) => {
    try {
      if (!window.confirm("Delete this doctor profile?")) {
        return;
      }

      const { data } = await axios.put("/api/doctor/deletedoctor", { userId });
      if (data.success) {
        toast.success(data.message || "Doctor removed");
        getAllDoctors();
      }
    } catch {
      toast.error("Unable to delete doctor");
    }
  };

  if (loading) {
    return <Loading label="Loading doctor applications..." />;
  }

  if (!doctors.length) {
    return <Empty title="No doctors to review" message="New doctor applications and approved profiles will appear here." />;
  }

  return (
    <section className="editorial-dashboard-stack">
      <div className="editorial-table-card">
        <div className="editorial-table-head">
          <div>
            <h2 className="editorial-card-title">Doctor review queue</h2>
            <p>Application status, credentials, and review actions are grouped in one cleaner table.</p>
          </div>
        </div>

        <div className="editorial-table-wrap">
          <table className="editorial-data-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Hospital</th>
                <th>City</th>
                <th>Status</th>
                <th>Certificate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>
                    <strong>Dr. {doctor.userId?.firstname} {doctor.userId?.lastname}</strong>
                    <small>{doctor.userId?.email}</small>
                  </td>
                  <td>{doctor.specialization || "Not provided"}</td>
                  <td>{doctor.hospitalName || "Not provided"}</td>
                  <td>{doctor.city || "Not provided"}</td>
                  <td>
                    <span className={`badge ${statusBadge(doctor.status)}`}>{doctor.status || "Pending"}</span>
                  </td>
                  <td>
                    {doctor.certificate ? (
                      <a href={doctor.certificate} target="_blank" rel="noopener noreferrer" className="editorial-btn editorial-btn-outline editorial-btn-sm">
                        Open file
                      </a>
                    ) : (
                      <span className="editorial-table-muted">Unavailable</span>
                    )}
                  </td>
                  <td>
                    <div className="editorial-action-row">
                      {doctor.status === "Pending" ? (
                        <>
                          <button className="editorial-btn editorial-btn-primary editorial-btn-sm" onClick={() => handleAction(doctor.userId?._id, "Approve")}>
                            Approve
                          </button>
                          <button className="editorial-btn editorial-btn-outline editorial-btn-sm" onClick={() => handleAction(doctor.userId?._id, "Reject")}>
                            Reject
                          </button>
                        </>
                      ) : null}
                      <button className="editorial-btn editorial-btn-danger editorial-btn-sm" onClick={() => deleteDoctor(doctor.userId?._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminDoctors;
