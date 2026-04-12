import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import fetchData from "../helper/apiCall";
import toast from "react-hot-toast";
import Loading from "./Loading";

const PatientHistory = ({ patientId, setModalOpen }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Important");

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

  const filteredReports = reports.filter(r => {
    const imp = (r.importance || "General").toLowerCase();
    const f = filter.toLowerCase();
    if (f === "all") return true;
    return imp === f;
  });

  return (
    <div className="modal flex-center report-modal-overlay">
      <div className="modal-content history-modal" style={{ maxWidth: '800px', width: '90%' }}>
        <button
          type="button"
          className="close-btn"
          onClick={() => setModalOpen(false)}
        >
          <IoMdClose />
        </button>
        <h2 className="modal-title">Patient Medical History</h2>
        
        <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
          {["Important", "General", "All"].map((f) => (
            <button 
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`} 
              onClick={() => setFilter(f)}
            >
              {f === "Important" ? "⭐ Critical History" : f === "General" ? "Routine Visits" : "All Records"}
            </button>
          ))}
        </div>

        {loading ? (
          <Loading />
        ) : filteredReports.length > 0 ? (
          <div className="history-timeline">
            {filteredReports.map((report) => (
              <div key={report._id} className="history-card" style={{ borderLeft: (report.importance === "Important") ? '4px solid var(--accent-warning)' : '4px solid var(--accent-success)' }}>
                <div className="history-header">
                  <div className="history-date">
                    {new Date(report.appointmentDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="history-doctor" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <strong>{report.doctorName}</strong> | {report.hospitalName}
                    <span className={`badge ${(report.importance === "Important") ? "badge-warning" : "badge-success"}`} style={{ marginLeft: 'auto' }}>
                        {(report.importance || "General").toUpperCase()}
                    </span>
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

                  {report.images && report.images.length > 0 && (
                    <div className="report-images-view">
                      <strong>Attached Analysis/Images:</strong>
                      <div className="images-grid">
                        {report.images.map((img, i) => (
                          <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="report-img-thumb">
                            <img src={img} alt="Medical record" />
                          </a>
                        ))}
                      </div>
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
          <div className="empty-history" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
             <img src="/images/empty-history.svg" alt="Empty" style={{ width: 120, opacity: 0.5, marginBottom: '1rem' }} onError={(e) => e.target.style.display='none'} />
            <p>No {filter !== "All" ? filter.toLowerCase() : ""} medical records found for this patient.</p>
            {filter !== "All" && (
                <button className="btn btn-secondary-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => setFilter("All")}>View All Records</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
