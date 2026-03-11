import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "./Loading";
import fetchData from "../helper/apiCall";
import Empty from "./Empty";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllAppointments = async () => {
    try {
      setLoading(true);
      const data = await fetchData(`/api/appointment/getallappointments`);
      setAppointments(data || []);
    } catch (error) {
      toast.error("Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case "Completed": return "badge-success";
      case "Pending": return "badge-warning";
      case "Cancelled": return "badge-danger";
      default: return "";
    }
  };

  return (
    <>
      <div className="admin-header">
        <h2 className="admin-title">System Appointments</h2>
      </div>

      {loading ? (
        <Loading />
      ) : appointments.length > 0 ? (
        <div className="admin-table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, i) => (
                <tr key={appt._id}>
                  <td>{i + 1}</td>
                  <td>Dr. {appt.doctorId?.firstname} {appt.doctorId?.lastname}</td>
                  <td>{appt.userId?.firstname} {appt.userId?.lastname}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>{appt.reason}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(appt.status)}`}>
                      {appt.status}
                    </span>
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

export default AdminAppointments;
