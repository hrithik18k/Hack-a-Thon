"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import fetchData from "../helper/apiCall";
import Empty from "./Empty";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const temp = await fetchData(`/api/user/getallusers`);
      // Filter out only patients
      const patients = temp.filter(u => u.role === "Patient");
      setUsers(patients);
    } catch (error) {
      toast.error("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this user?");
      if (confirm) {
        const { data } = await axios.delete("/api/user/deleteuser", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: { userId }, // axios delete payload
        });
        if (data.success) {
          toast.success(data.message || "User deleted");
          getAllUsers();
        }
      }
    } catch (error) {
      toast.error("Unable to delete user");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <div className="admin-header">
        <h2 className="admin-title">Manage Patients</h2>
      </div>

      {loading ? (
        <Loading />
      ) : users.length > 0 ? (
        <div className="admin-table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user._id}>
                  <td>{i + 1}</td>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.gender || "N/A"}</td>
                  <td>{user.city}</td>
                  <td>
                    <button 
                      className="btn btn-danger-outline btn-sm"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
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

export default Users;
