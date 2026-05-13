"use client";

import React, { useEffect, useState } from "react";
import fetchData from "../helper/apiCall";
import Empty from "./Empty";
import Loading from "./Loading";
import toast from "react-hot-toast";

const statusBadge = (status) => {
  switch (status) {
    case "Completed":
      return "badge-success";
    case "Pending":
      return "badge-warning";
    case "Cancelled":
      return "badge-danger";
    default:
      return "";
  }
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllAppointments() {
      try {
        setLoading(true);
        const data = await fetchData("/api/appointment/getallappointments");
        setAppointments(data || []);
      } catch {
        toast.error("Unable to load appointments");
      } finally {
        setLoading(false);
      }
    }

    getAllAppointments();
  }, []);

  if (loading) {
    return <Loading label="Loading system appointments..." />;
  }

  if (!appointments.length) {
    return <Empty title="No appointments recorded" message="System-wide consultation activity will appear here." />;
  }

  return (
    <section className="editorial-dashboard-stack">
      <div className="editorial-table-card">
        <div className="editorial-table-head">
          <div>
            <h2 className="editorial-card-title">Appointment activity</h2>
            <p>Track consultation timing and status across doctors and patients.</p>
          </div>
        </div>

        <div className="editorial-table-wrap">
          <table className="editorial-data-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>Dr. {appointment.doctorId?.firstname} {appointment.doctorId?.lastname}</td>
                  <td>{appointment.userId?.firstname} {appointment.userId?.lastname}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.reason}</td>
                  <td>
                    <span className={`badge ${statusBadge(appointment.status)}`}>{appointment.status}</span>
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

export default AdminAppointments;
