import React from "react";
import AdminAppointments from "../components/AdminAppointments";
import AdminDoctors from "../components/AdminDoctors";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";
import DashboardHome from "../components/DashboardHome";
import "../styles/admin.css";

const Dashboard = ({ type }) => {
  return (
    <>
      <section className="layout-section">
        <Sidebar />
        <div className="layout-content">
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
