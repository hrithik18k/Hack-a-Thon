import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fetchData from "../helper/apiCall";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import Empty from "../components/Empty";
import { IoMdClose, IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

const MedicalHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await fetchData("/api/report/mine");
      if (data) {
        setReports(data || []);
      }
    } catch (error) {
      toast.error("Failed to load your medical history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const [filter, setFilter] = useState("All");

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
    <>
      <Navbar />
      <section className="appts-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="page-title" style={{ marginBottom: 0 }}>My Medical History</h2>
            <div className="filter-tabs" style={{ margin: 0, scale: '0.9' }}>
               {["Important", "General", "All"].map(f => {
                 const getFilterLabel = (filterType) => {
                   if (filterType === "Important") return "Critical";
                   if (filterType === "General") return "Routine";
                   return "All";
                 };
                 return (
                   <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                      {getFilterLabel(f)}
                   </button>
                 );
               })}
            </div>
          </div>
          
          {loading ? (
            <Loading />
          ) : filteredReports.length > 0 ? (
            <div className="history-timeline">
              {filteredReports.map((report) => {
                const isExpanded = expandedId === report._id;
                return (
                  <div key={report._id} className="history-strip-wrapper">
                    {/* Collapsed Strip */}
                    <div
                      className={`history-strip ${isExpanded ? "expanded" : ""}`}
                      style={{ borderLeftColor: (report.importance === "Important") ? 'var(--accent-warning)' : 'var(--accent-success)' }}
                      onClick={() => toggleExpand(report._id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(report._id); } }}
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
                        <div className="history-detail-row">
                          <strong>Diagnosis:</strong> {report.diagnosis}
                        </div>
                        {report.notes && (
                          <div className="history-detail-row">
                            <strong>Notes:</strong> {report.notes}
                          </div>
                        )}
                        
                        {report.medications?.length > 0 && (
                          <div className="history-detail-row">
                            <strong>Prescribed Medications:</strong>
                            <ul className="meds-list-inline">
                              {report.medications.map((med, i) => (
                                <li key={med._id || `${i}-${med.name}`}>
                                  <span className="med-name">{med.name}</span> — {med.dosage}, {med.frequency} for {med.duration}
                                  {med.notes && <em> ({med.notes})</em>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {report.images?.length > 0 && (
                          <div className="history-detail-row">
                            <strong>Attached Images:</strong>
                            <div className="images-grid" style={{ marginTop: '0.5rem' }}>
                              {report.images.map((img, i) => (
                                <div
                                  key={img._id || `${i}-${img}`}
                                  className="report-img-thumb"
                                  onClick={(e) => { e.stopPropagation(); setLightboxImg(secureUrl(img)); }}
                                  style={{ cursor: 'pointer' }}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setLightboxImg(secureUrl(img)); } }}
                                >
                                  <img src={secureUrl(img)} alt="Medical record" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {report.followUpDate && (
                          <div className="history-detail-row follow-up">
                            <strong>Follow-up Date:</strong> {new Date(report.followUpDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-history" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <Empty />
                {filter !== "All" && <button className="btn btn-secondary-outline btn-sm" onClick={() => setFilter("All")}>Clear Filters</button>}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal for Enlarged Image */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setLightboxImg(null); }}>
          <button className="lightbox-close" onClick={() => setLightboxImg(null)}>
            <IoMdClose />
          </button>
          <img src={lightboxImg} alt="Enlarged medical record" className="lightbox-image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <Footer />
    </>
  );
};

export default MedicalHistory;
