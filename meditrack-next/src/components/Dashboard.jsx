"use client";

import PropTypes from 'prop-types';
import React, { useState } from "react";
import AdminAppointments from "../components/AdminAppointments";
import AdminDoctors from "../components/AdminDoctors";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";
import DashboardHome from "../components/DashboardHome";
import { FiMenu } from "react-icons/fi";

const Dashboard = ({ type }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch(type) {
      case "home": return <DashboardHome />;
      case "users": return <Users />;
      case "doctors": return <AdminDoctors />;
      case "appointments": return <AdminAppointments />;
      default: return null;
    }
  };

  return (
    <>
      <section className="layout-section">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setSidebarOpen(false); }} />
        )}
        <div className="layout-content">
          <div className="layout-content-header">
            <button
              className="sidebar-hamburger"
              onClick={() => setSidebarOpen(true)}
              title="Open sidebar"
            >
              <FiMenu />
            </button>
          </div>
          {renderContent()}
        </div>
      </section>
    </>
  );
};

export default Dashboard;

Dashboard.propTypes = {
  type: PropTypes.any
};
