import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdClose, IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import fetchData from "../helper/apiCall";
import toast from "react-hot-toast";
import Loading from "./Loading";

const PatientHistory = ({ patientId, setModalOpen }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Important");
  const [expandedId, setExpandedId] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

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

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Fix http -> https for cloudinary images
  const secureUrl = (url) => {
    if (url && url.startsWith("http://res.cloudinary.com")) {
      return url.replace("http://", "https://");
    }
    return url;
  };

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
          <div className="history-timeline" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {filteredReports.map((report) => {
              const isExpanded = expandedId === report._id;
              return (
                <div key={report._id} className="history-strip-wrapper">
                  {/* Collapsed Strip */}
                  <div
                    className={`history-strip ${isExpanded ? "expanded" : ""}`}
                    style={{ borderLeftColor: (report.importance === "Important") ? 'var(--accent-warning)' : 'var(--accent-success)' }}
                    onClick={() => toggleExpand(report._id)}
                  >
                    <span className="strip-toggle-icon">
                      {isExpanded ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
                    </span>
                    <span className="strip-date">
                      {new Date(report.appointmentDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="strip-doctor">{report.doctorName}</span>
                    <span className="strip-diagnosis">{report.diagnosis}</span>
                    <span className={`badge ${(report.importance === "Important") ? "badge-warning" : "badge-success"}`} style={{ fontSize: '0.7rem', marginLeft: 'auto', flexShrink: 0 }}>
                      {(report.importance || "General").toUpperCase()}
                    </span>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="history-details" style={{ borderLeftColor: (report.importance === "Important") ? 'var(--accent-warning)' : 'var(--accent-success)' }}>
                      <div className="history-detail-row">
                        <strong>Hospital:</strong> {report.hospitalName}
                      </div>
                      {report.notes && (
                        <div className="history-detail-row">
                          <strong>Notes:</strong> {report.notes}
                        </div>
                      )}
                      
                      {report.medications && report.medications.length > 0 && (
                        <div className="history-detail-row">
                          <strong>Prescribed Medications:</strong>
                          <ul className="meds-list-inline">
                            {report.medications.map((med, i) => (
                              <li key={i}>
                                <span className="med-name">{med.name}</span> — {med.dosage}, {med.frequency} for {med.duration}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {report.images && report.images.length > 0 && (
                        <div className="history-detail-row">
                          <strong>Attached Images:</strong>
                          <div className="images-grid" style={{ marginTop: '0.5rem' }}>
                            {report.images.map((img, i) => (
                              <div
                                key={i}
                                className="report-img-thumb"
                                onClick={(e) => { e.stopPropagation(); setLightboxImg(secureUrl(img)); }}
                                style={{ cursor: 'pointer' }}
                              >
                                <img src={secureUrl(img)} alt="Medical record" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {report.followUpDate && (
                        <div className="history-detail-row follow-up">
                          <strong>Follow-up:</strong> {new Date(report.followUpDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* Lightbox Modal for Enlarged Image */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImg(null)}>
            <IoMdClose />
          </button>
          <img src={lightboxImg} alt="Enlarged medical record" className="lightbox-image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default PatientHistory;

PatientHistory.propTypes = {
  patientId: PropTypes.any,
  setModalOpen: PropTypes.any
};
