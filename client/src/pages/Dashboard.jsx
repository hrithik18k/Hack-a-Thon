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

  return (
    <>
      <section className="layout-section">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
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
          {type === "home" ? (
            <DashboardHome />
          ) : type === "users" ? (
            <Users />
          ) : type === "doctors" ? (
            <AdminDoctors />
          ) : type === "appointments" ? (
            <AdminAppointments />
          ) : (
            <></>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;

Dashboard.propTypes = {
  type: PropTypes.any
};
