import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import fetchData from "../helper/apiCall";
import toast from "react-hot-toast";
import Loading from "./Loading";

const PatientHistory = ({ patientId, setModalOpen }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await fetchData(`/api/report/patient/${patientId}`);
      if (data) {
        setReports(data || []);
      }
    } catch (error) {
      toast.error("Failed to load patient history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [patientId]);

  return (
    <div className="modal flex-center report-modal-overlay">
      <div className="modal-content history-modal">
        <button
          type="button"
          className="close-btn"
          onClick={() => setModalOpen(false)}
        >
          <IoMdClose />
        </button>
        <h2 className="modal-title">Patient Medical History</h2>
        <p className="modal-subtitle">Comprehensive past appointment reports</p>

        {loading ? (
          <Loading />
        ) : reports.length > 0 ? (
          <div className="history-timeline">
            {reports.map((report) => (
              <div key={report._id} className="history-card">
                <div className="history-header">
                  <div className="history-date">
                    {new Date(report.appointmentDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="history-doctor">
                    <strong>{report.doctorName}</strong> | {report.hospitalName}
                  </div>
                </div>
                
                <div className="history-body">
                  <p><strong>Diagnosis:</strong> {report.diagnosis}</p>
                  {report.notes && <p><strong>Notes:</strong> {report.notes}</p>}
                  
                  {report.medications && report.medications.length > 0 && (
                    <div className="meds-list">
                      <strong>Prescribed Medications:</strong>
                      <ul>
                        {report.medications.map((med, i) => (
                          <li key={i}>
                            <span className="med-name">{med.name}</span> - {med.dosage}, {med.frequency} for {med.duration}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {report.followUpDate && (
                    <p className="follow-up">
                      <strong>Follow-up:</strong> {new Date(report.followUpDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-history">
            <p>No medical history found for this patient.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
