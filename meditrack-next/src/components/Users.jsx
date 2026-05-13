"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import fetchData from "../helper/apiCall";
import Empty from "./Empty";
import Loading from "./Loading";
import toast from "react-hot-toast";

axios.defaults.baseURL = getApiBaseUrl();

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchData("/api/user/getallusers");
      setUsers((data || []).filter((user) => user.role === "Patient"));
    } catch {
      toast.error("Unable to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      if (!window.confirm("Delete this patient record?")) {
        return;
      }

      const { data } = await axios.delete("/api/user/deleteuser", {
        data: { userId },
      });

      if (data.success) {
        toast.success(data.message || "Patient deleted");
        getAllUsers();
      }
    } catch {
      toast.error("Unable to delete patient");
    }
  };

  if (loading) {
    return <Loading label="Loading patient directory..." />;
  }

  if (!users.length) {
    return <Empty title="No patients registered" message="Patient accounts will appear here after sign-up." />;
  }

  return (
    <section className="editorial-dashboard-stack">
      <div className="editorial-table-card">
        <div className="editorial-table-head">
          <div>
            <h2 className="editorial-card-title">Patient directory</h2>
            <p>Patient records are easier to review, with less visual noise and clearer actions.</p>
          </div>
        </div>

        <div className="editorial-table-wrap">
          <table className="editorial-data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <strong>{user.firstname} {user.lastname}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || "Not provided"}</td>
                  <td>{user.gender || "Not provided"}</td>
                  <td>{user.city || "Not provided"}</td>
                  <td>
                    <button className="editorial-btn editorial-btn-danger editorial-btn-sm" onClick={() => deleteUser(user._id)}>
                      Delete
                    </button>
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

export default Users;
