import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { toast } from "react-hot-toast";
import jwt_decode from "jwt-decode";
import axios from "axios";
import "../styles/user.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PerPage = 5;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const { userId, role } = jwt_decode(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getAllAppoint = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(
        `/api/appointment/getallappointments?search=${userId}`
      );
      setAppointments(temp);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments. Please try again.");
    }
  };

  useEffect(() => {
    getAllAppoint();
  }, []);

  const totalPages = Math.ceil(appointments.length / PerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button key={i} onClick={() => handlePageChange(i)}>
          {i}
        </button>
      );
    }
    return pages;
  };

  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * PerPage,
    currentPage * PerPage
  );

  const completeAppointment = async (appointment) => {
    try {
      await axios.put(
        "/api/appointment/completed",
        {
          appointid: appointment._id,
          doctorId: appointment.doctorId._id,
          doctorname: `${appointment.userId.firstname} ${appointment.userId.lastname}`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Appointment completed successfully.");
      getAllAppoint();
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Failed to complete appointment. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="container notif-section">
          <h2 className="page-heading">Your Appointments</h2>

          {appointments.length > 0 ? (
            <div className="appointments">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Doctor</th>
                    <th>P Name</th>
                    <th>P Age</th>
                    <th>P Gender</th>
                    <th>P Mobile No.</th>
                    <th>P bloodGroup</th>
                    <th>P Family Diseases</th>
                    <th>Appointment Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAppointments.map((appointment, index) => (
                    <tr key={appointment._id}>
                      <td>{(currentPage - 1) * PerPage + index + 1}</td>
                      <td>{`${appointment.doctorId.firstname} ${appointment.doctorId.lastname}`}</td>
                      <td>{`${appointment.userId.firstname} ${appointment.userId.lastname}`}</td>
                      <td>{appointment.age}</td> 
                      <td>{appointment.gender}</td>
                      <td>{appointment.number}</td>
                      <td>{appointment.bloodGroup}</td>
                      <td>{appointment.familyDiseases}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.status}</td>
                      <td>
                        <div className="flex-center" style={{ gap: "0.5rem" }}>
                          {role === "Doctor" && (
                            <button
                              className="btn user-btn"
                              style={{ backgroundColor: "#4361ee" }}
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowModal(true);
                              }}
                            >
                              Open
                            </button>
                          )}
                          <button
                            className="btn user-btn complete-btn"
                            onClick={() => completeAppointment(appointment)}
                            disabled={appointment.status === "Completed"}
                          >
                            Complete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">{renderPagination()}</div>
            </div>
          ) : (
            <Empty message="No appointments found." />
          )}
        </section>
      )}

      {showModal && selectedAppointment && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <div className="modal-header" style={modalHeaderStyle}>
              <h3>Patient Details</h3>
              <button
                className="close-btn"
                style={closeBtnStyle}
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body" style={modalBodyStyle}>
              <div className="detail-row">
                <strong>Patient ID:</strong>{" "}
                <span style={{ fontFamily: "monospace", backgroundColor: "#f0f0f0", padding: "2px 5px", borderRadius: "3px" }}>
                  {selectedAppointment.userId?._id}
                </span>
              </div>
              <div className="detail-row">
                <strong>Full Name:</strong> {`${selectedAppointment.userId?.firstname} ${selectedAppointment.userId?.lastname}`}
              </div>
              <div className="detail-row">
                <strong>Age:</strong> {selectedAppointment.age}
              </div>
              <div className="detail-row">
                <strong>Gender:</strong> {selectedAppointment.gender}
              </div>
              <div className="detail-row">
                <strong>Contact:</strong> {selectedAppointment.number}
              </div>
              <div className="detail-row">
                <strong>Blood Group:</strong> {selectedAppointment.bloodGroup}
              </div>
              <div className="detail-row">
                <strong>Family Diseases:</strong> {selectedAppointment.familyDiseases}
              </div>
              <div className="detail-row">
                <strong>Appointment Date:</strong> {selectedAppointment.date}
              </div>
              <div className="detail-row">
                <strong>Time:</strong> {selectedAppointment.time}
              </div>
              <div className="detail-row">
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    color: "white",
                    fontSize: "0.8rem",
                    backgroundColor:
                      selectedAppointment.status === "Completed"
                        ? "#28a745"
                        : "#ffc107",
                  }}
                >
                  {selectedAppointment.status}
                </span>
              </div>
            </div>
            <div className="modal-footer" style={modalFooterStyle}>
              <button
                className="btn user-btn"
                style={{ backgroundColor: "#28a745", color: "white" }}
                onClick={() => {
                  const patientId = selectedAppointment.userId?._id || selectedAppointment.userId;
                  const patientFirstname = selectedAppointment.userId?.firstname || "";
                  const patientLastname = selectedAppointment.userId?.lastname || "";
                  navigate(
                    `/prescriptions?patientId=${patientId}&patientName=${patientFirstname} ${patientLastname}`
                  );
                }}
              >
                Write Prescription
              </button>
              <button
                className="btn user-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "10px",
  width: "90%",
  maxWidth: "500px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  maxHeight: "80vh",
  overflowY: "auto",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #eee",
  marginBottom: "1rem",
  paddingBottom: "1rem",
};

const modalBodyStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
};

const modalFooterStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "1rem",
  marginTop: "2rem",
  paddingTop: "1rem",
  borderTop: "1px solid #eee",
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "2rem",
  cursor: "pointer",
  color: "#333",
};

export default Appointments;
