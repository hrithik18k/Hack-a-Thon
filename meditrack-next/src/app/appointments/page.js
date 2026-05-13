"use client";

import { Protected } from "../../middleware/route";
import React, { useEffect, useState } from "react";
import axios from "axios";
import fetchData from "../../helper/apiCall";
import Empty from "../../components/Empty";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import PatientHistory from "../../components/PatientHistory";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/lib/useAuthSession";
import EditorialShell from "../../components/editorial/EditorialShell";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyModal, setHistoryModal] = useState({ open: false, patientId: null });
  const [slotModal, setSlotModal] = useState(false);
  const [slotDetails, setSlotDetails] = useState({ startTime: "09:00", endTime: "17:00", duration: 30 });
  const [slotSaving, setSlotSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();
  const { ready, user } = useAuthSession();

  const getAllAppointments = async () => {
    try {
      setLoading(true);
      const data = await fetchData(
        `/api/appointment/getallappointments?search=${user._id}`
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
    if (!ready || !user?._id) return;

    getAllAppointments();
    if (user.role === "Doctor") {
      fetchData("/api/doctor/getalldoctors").then(data => {
        if (Array.isArray(data)) {
          const me = data.find(d => d.userId?._id === user._id);
          if (me?.slotConfig) {
            setSlotDetails(me.slotConfig);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user]);

  const saveSlots = async (e) => {
    e.preventDefault();
    setSlotSaving(true);
    try {
      const response = await axios.put("/api/doctor/updateslots", slotDetails, {
        withCredentials: true,
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
    <EditorialShell>
      <main className="editorial-page">
        <section className="editorial-page-hero">
          <div className="editorial-shell">
            <div className="editorial-page-head-row">
              <div>
                <span className="editorial-eyebrow">{user?.role === "Doctor" ? "Doctor schedule" : "Patient calendar"}</span>
                <h1 className="editorial-page-title">Appointments and follow-up actions in one timeline.</h1>
                <p className="editorial-lede">
                  The data is unchanged. The screen is now organized around the next action instead of a generic table.
                </p>
              </div>
              {user?.role === "Doctor" && (
                <button className="editorial-btn editorial-btn-primary" onClick={() => setSlotModal(true)}>
                  Manage slots
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="editorial-section editorial-section-tight">
          <div className="editorial-shell">
            {loading ? (
              <Loading />
            ) : appointments.length > 0 ? (
              <>
                <div className="editorial-appointments-grid">
                  {currentItems.map((ele, idx) => {
                    const absoluteIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                    return (
                      <article key={ele._id} className="editorial-appt-card">
                        <div className="editorial-appt-topline">
                          <span>#{absoluteIndex}</span>
                          <span className={`badge ${getStatusBadge(ele.status)}`}>{ele.status}</span>
                        </div>
                        <h3>
                          {user?.role === "Doctor"
                            ? `${ele.userId?.firstname || ""} ${ele.userId?.lastname || ""}`
                            : `Dr. ${ele.doctorId?.firstname || ""} ${ele.doctorId?.lastname || ""}`}
                        </h3>
                        <p>{ele.reason}</p>
                        <div className="editorial-appt-meta">
                          <span>{ele.date}</span>
                          <span>{ele.time}</span>
                          {user?.role === "Doctor" ? <span>{ele.gender} · {ele.age}</span> : null}
                        </div>

                        <div className="editorial-appt-actions">
                          {user?.role === "Doctor" ? (
                            <>
                              <button
                                className="editorial-btn editorial-btn-outline"
                                onClick={() => setHistoryModal({ open: true, patientId: ele.userId?._id })}
                              >
                                Open patient
                              </button>
                              {ele.status === "Pending" ? (
                                <button
                                  className="editorial-btn editorial-btn-primary"
                                  onClick={() => {
                                    sessionStorage.setItem("writeReportAppointment", JSON.stringify(ele));
                                    router.push("/doctor/write-report");
                                  }}
                                >
                                  Write report
                                </button>
                              ) : null}
                            </>
                          ) : ele.status === "Completed" ? (
                            <button
                              className="editorial-btn editorial-btn-primary"
                              onClick={() => router.push("/medical-history")}
                            >
                              View report
                            </button>
                          ) : (
                            <span className="editorial-inline-note">Awaiting completion before report access.</span>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="editorial-pagination">
                    <button className="editorial-btn editorial-btn-outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                      Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button className="editorial-btn editorial-btn-outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Empty title="No appointments found" message="You do not have any appointments scheduled yet." />
            )}
          </div>
        </section>
      </main>

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
    </EditorialShell>
  );
};

const ProtectedAppointments = () => <Protected><Appointments /></Protected>;

export default ProtectedAppointments;
