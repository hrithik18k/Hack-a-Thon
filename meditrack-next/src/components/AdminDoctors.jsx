"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import fetchData from "../helper/apiCall";
import Empty from "./Empty";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllDoctors = async () => {
    try {
      setLoading(true);
      const pendingRes = await fetchData(`/api/doctor/getnotdoctors`);
      const approvedRes = await fetchData(`/api/doctor/getalldoctors`);
      const allDocs = [...(pendingRes || []), ...(approvedRes || [])];
      setDoctors(allDocs);
    } catch (error) {
      toast.error("Unable to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      const endpoint = action === "Approve" ? "/api/doctor/acceptdoctor" : "/api/doctor/rejectdoctor";
      const confirmStr = `Are you sure you want to ${action.toLowerCase()} this doctor?`;
      
      if (window.confirm(confirmStr)) {
        const { data } = await axios.put(endpoint, { userId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (data.success) {
          toast.success(data.message || `Doctor ${action.toLowerCase()}ed`);
          getAllDoctors();
        }
      }
    } catch (error) {
      toast.error(`Unable to ${action.toLowerCase()} doctor`);
    }
  };

  const deleteDoctor = async (userId) => {
    try {
      if (window.confirm("Are you sure you want to delete this doctor?")) {
        const { data } = await axios.put("/api/doctor/deletedoctor", { userId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (data.success) {
          toast.success(data.message || "Doctor removed");
          getAllDoctors();
        }
      }
    } catch (error) {
      toast.error("Unable to delete doctor");
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case "Approved": return "badge-success";
      case "Pending": return "badge-warning";
      case "Rejected": return "badge-danger";
      default: return "";
    }
  };

  return (
    <>
      <div className="admin-header">
        <h2 className="admin-title">Manage Doctors</h2>
      </div>

      {loading ? (
        <Loading />
      ) : doctors.length > 0 ? (
        <div className="admin-table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Hospital</th>
                <th>City</th>
                <th>Status</th>
                <th>Certificate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, i) => (
                <tr key={doc._id}>
                  <td>{i + 1}</td>
                  <td>Dr. {doc.userId?.firstname} {doc.userId?.lastname}</td>
                  <td>{doc.userId?.email}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.hospitalName}</td>
                  <td>{doc.city}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(doc.status)}`}>
                      {doc.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    {doc.certificate ? (
                      <a href={doc.certificate} target="_blank" rel="noopener noreferrer" className="btn btn-secondary-outline btn-sm">
                        View Doc
                      </a>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>No Doc</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {doc.status === "Pending" && (
                        <>
                          <button 
                            className="btn btn-primary-outline btn-sm"
                            onClick={() => handleAction(doc.userId?._id, "Approve")}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-danger-outline btn-sm"
                            onClick={() => handleAction(doc.userId?._id, "Reject")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button 
                        className="btn btn-danger-outline btn-sm"
                        onClick={() => deleteDoctor(doc.userId?._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default AdminDoctors;
