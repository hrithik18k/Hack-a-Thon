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

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const [users, pendingDoctors, appointments, approvedDoctors] = await Promise.all([
          fetchData("/api/user/getallusers"),
          fetchData("/api/doctor/getnotdoctors"),
          fetchData("/api/appointment/getallappointments"),
          fetchData("/api/doctor/getalldoctors"),
        ]);

        setStats({
          users: users?.length || 0,
          doctors: (pendingDoctors?.length || 0) + (approvedDoctors?.length || 0),
          appointments: appointments?.length || 0,
        });
      } catch {
        toast.error("Failed to fetch dashboard metrics");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <Loading label="Loading operational metrics..." />;
  }

  return (
    <section className="editorial-dashboard-stack">
      <div className="editorial-stat-grid">
        <article className="editorial-stat-card">
          <span>Registered patients</span>
          <strong>{stats.users}</strong>
          <p>Total patient accounts with care access.</p>
        </article>
        <article className="editorial-stat-card">
          <span>Doctor profiles</span>
          <strong>{stats.doctors}</strong>
          <p>Approved and pending clinicians in the review pipeline.</p>
        </article>
        <article className="editorial-stat-card">
          <span>Appointments logged</span>
          <strong>{stats.appointments}</strong>
          <p>Scheduled consultations tracked by the platform.</p>
        </article>
      </div>

      <div className="editorial-info-band">
        <div>
          <h2 className="editorial-card-title">Platform health is easier to scan now.</h2>
          <p>
            The dashboard keeps the information density an admin console needs, but with calmer spacing,
            clearer headings, and a more clinical visual rhythm.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardHome;
