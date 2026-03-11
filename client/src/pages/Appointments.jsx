import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fetchData from "../helper/apiCall";
import Empty from "../components/Empty";
import jwtDecode from "jwt-decode";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import PatientHistory from "../components/PatientHistory";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyModal, setHistoryModal] = useState({ open: false, patientId: null });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let user = null;
  if (token) user = jwtDecode(token);

  const getAllAppointments = async () => {
    try {
      setLoading(true);
      const data = await fetchData(
        `/api/appointment/getallappointments?search=${user.userId}`
      );
      setAppointments(data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
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
      <Navbar />
      <section className="appts-section">
        <div className="container">
          <h2 className="page-title">
            {user?.role === "Doctor" ? "My Appointments" : "My Appointments"}
          </h2>
          {loading ? (
            <Loading />
          ) : appointments.length > 0 ? (
            <div className="table-wrapper">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    {user?.role === "Doctor" ? <th>Patient Name</th> : <th>Doctor Name</th>}
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    {user?.role === "Doctor" && (
                      <>
                        <th>Age</th>
                        <th>Gender</th>
                      </>
                    )}
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((ele, i) => (
                    <tr key={ele._id}>
                      <td>{i + 1}</td>
                      {user?.role === "Doctor" ? (
                        <td>{ele.userId?.firstname} {ele.userId?.lastname}</td>
                      ) : (
                        <td>Dr. {ele.doctorId?.firstname} {ele.doctorId?.lastname}</td>
                      )}
                      <td>{ele.date}</td>
                      <td>{ele.time}</td>
                      <td>{ele.reason}</td>
                      {user?.role === "Doctor" && (
                        <>
                          <td>{ele.age}</td>
                          <td>{ele.gender}</td>
                        </>
                      )}
                      <td>
                        <span className={`badge ${getStatusBadge(ele.status)}`}>
                          {ele.status}
                        </span>
                      </td>
                      <td className="action-cell">
                        {user?.role === "Doctor" && (
                          <div className="action-buttons">
                            <button
                              className="btn btn-secondary-outline btn-sm"
                              onClick={() => setHistoryModal({ open: true, patientId: ele.userId?._id })}
                            >
                              Open Patient
                            </button>
                            {ele.status === "Pending" && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => navigate("/doctor/write-report", { state: { appt: ele } })}
                              >
                                Write Report
                              </button>
                            )}
                          </div>
                        )}
                        {user?.role === "Patient" && ele.status === "Completed" && (
                          <button
                            className="btn btn-primary-outline btn-sm"
                            onClick={() => window.location.href = `/medical-history`}
                          >
                            View Report
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </section>

      {historyModal.open && (
         <PatientHistory 
            patientId={historyModal.patientId} 
             setModalOpen={(val) => setHistoryModal({ open: val, patientId: null })}
          />
      )}

      <Footer />
    </>
  );
};

export default Appointments;
