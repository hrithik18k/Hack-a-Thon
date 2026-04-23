import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const [slotModal, setSlotModal] = useState(false);
  const [slotDetails, setSlotDetails] = useState({ startTime: "09:00", endTime: "17:00", duration: 30 });
  const [slotSaving, setSlotSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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
      // Ensure we sort dynamically, newest first
      setAppointments(data?.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) || []);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAppointments();
    if (user?.role === "Doctor") {
      fetchData("/api/doctor/getalldoctors").then(data => {
        if (Array.isArray(data)) {
          const me = data.find(d => d.userId?._id === user.userId);
          if (me?.slotConfig) {
            setSlotDetails(me.slotConfig);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSlots = async (e) => {
    e.preventDefault();
    setSlotSaving(true);
    try {
      const response = await axios.put("/api/doctor/updateslots", slotDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success("Slots updated successfully!");
        setSlotModal(false);
      } else {
        toast.error("Failed to update slots");
      }
    } catch (err) {
      toast.error("Error updating slots");
    } finally {
      setSlotSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Completed": return "badge-success";
      case "Pending": return "badge-warning";
      case "Cancelled": return "badge-danger";
      default: return "";
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const currentItems = appointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Navbar />
      <section className="appts-section">
        <div className="container">
          <div className="appts-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="page-title" style={{ marginBottom: 0 }}>
              {user?.role === "Doctor" ? "My Appointments" : "My Appointments"}
            </h2>
            {user?.role === "Doctor" && (
              <button className="btn btn-primary" onClick={() => setSlotModal(true)}>
                Manage Slots
              </button>
            )}
          </div>
          {loading ? (
            <Loading />
          ) : appointments.length > 0 ? (
            <>
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
                    {currentItems.map((ele, idx) => {
                      const absoluteIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                      return (
                      <tr key={ele._id}>
                        <td>{absoluteIndex}</td>
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
                                  + Report
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
                    )})}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '0.5rem', alignItems: 'center' }}>
                  <button className="btn btn-secondary-outline btn-sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Page {currentPage} of {totalPages}</span>
                  <button className="btn btn-secondary-outline btn-sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                </div>
              )}
            </>
          ) : (
            <Empty title="No Appointments Found" message="You don't have any appointments scheduled yet." />
          )}
        </div>
      </section>

      {slotModal && (
        <div className="modal flex-center">
          <div className="modal-content" style={{ maxWidth: 400 }}>
            <h3 className="modal-title">Manage Consulting Slots</h3>
            <p className="modal-subtitle">Define when patients can book appointments with you.</p>
            <form onSubmit={saveSlots} className="modal-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label>Start Time (24hr)</label>
                  <input type="time" className="form-input" value={slotDetails.startTime} onChange={e => setSlotDetails({ ...slotDetails, startTime: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>End Time (24hr)</label>
                  <input type="time" className="form-input" value={slotDetails.endTime} onChange={e => setSlotDetails({ ...slotDetails, endTime: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Slot Duration</label>
                <select className="form-input" value={slotDetails.duration} onChange={e => setSlotDetails({ ...slotDetails, duration: Number(e.target.value) })}>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" className="btn btn-primary btn-full" disabled={slotSaving}>
                  {slotSaving ? "Saving..." : "Save Settings"}
                </button>
                <button type="button" className="btn btn-secondary-outline btn-full" onClick={() => setSlotModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
