"use client";

import PropTypes from "prop-types";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import AdminAppointments from "../components/AdminAppointments";
import AdminDoctors from "../components/AdminDoctors";
import DashboardHome from "../components/DashboardHome";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";

const metaByType = {
  home: {
    eyebrow: "Administration",
    title: "Operational overview for the Medi Track platform.",
    description: "Monitor patient, doctor, and appointment activity with a cleaner command view.",
  },
  users: {
    eyebrow: "Patient directory",
    title: "Review patient records registered on the platform.",
    description: "The patient list now uses the same calm dashboard language as the rest of the product.",
  },
  doctors: {
    eyebrow: "Doctor approvals",
    title: "Manage clinician onboarding and verification.",
    description: "Approve, reject, or remove doctor applications without leaving the admin flow.",
  },
  appointments: {
    eyebrow: "Appointment monitoring",
    title: "Track booking activity across the system.",
    description: "See consultation volume, timing, and status with less table clutter.",
  },
};

const Dashboard = ({ type }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const meta = metaByType[type] || metaByType.home;

  const renderContent = () => {
    switch (type) {
      case "home":
        return <DashboardHome />;
      case "users":
        return <Users />;
      case "doctors":
        return <AdminDoctors />;
      case "appointments":
        return <AdminAppointments />;
      default:
        return null;
    }
  };

  return (
    <main className="editorial-dashboard-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen ? <button className="editorial-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" /> : null}

      <section className="editorial-dashboard-main">
        <div className="editorial-shell">
          <div className="editorial-dashboard-hero">
            <button className="editorial-dashboard-menu" onClick={() => setSidebarOpen(true)} title="Open admin navigation">
              <FiMenu />
            </button>
            <div>
              <span className="editorial-eyebrow">{meta.eyebrow}</span>
              <h1 className="editorial-page-title">{meta.title}</h1>
              <p className="editorial-lede">{meta.description}</p>
            </div>
          </div>
          {renderContent()}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;

Dashboard.propTypes = {
  type: PropTypes.any,
};
