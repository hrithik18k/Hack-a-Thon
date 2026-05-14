"use client";

import React, { useEffect, useState } from "react";
import fetchData from "../helper/apiCall";
import toast from "react-hot-toast";
import Loading from "./Loading";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Let's create a combined request or separate based on what controllers we have.
      // We have getallusers, getalldoctors, getallappointments
      const [uRes, dRes, aRes, appDocs] = await Promise.all([
        fetchData("/api/user/getallusers"),
        fetchData("/api/doctor/getnotdoctors"), // pending/approved/rejected
        fetchData("/api/appointment/getallappointments"),
        fetchData("/api/doctor/getalldoctors") // only approved
      ]);

      setStats({
        users: uRes?.length || 0,
        doctors: ((dRes?.length || 0) + (appDocs?.length || 0)),
        appointments: aRes?.length || 0,
      });
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">System Overview</h2>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-title">Total Users</span>
            <span className="stat-value">{stats.users}</span>
          </div>
          <div className="stat-card">
            <span className="stat-title">Total Doctors</span>
            <span className="stat-value">{stats.doctors}</span>
          </div>
          <div className="stat-card">
            <span className="stat-title">Total Appointments</span>
            <span className="stat-value">{stats.appointments}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
