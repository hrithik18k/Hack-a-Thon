import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fetchData from "../helper/apiCall";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import Empty from "../components/Empty";

const MedicalHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Navbar />
      <section className="appts-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="page-title" style={{ marginBottom: 0 }}>My Medical History</h2>
            <div className="filter-tabs" style={{ margin: 0, scale: '0.9' }}>
               {["Important", "General", "All"].map(f => (
                 <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                    {f === "Important" ? "Critical" : f === "General" ? "Routine" : "All"}
                 </button>
               ))}
            </div>
          </div>
          
          {loading ? (
            <Loading />
          ) : filteredReports.length > 0 ? (
            <div className="history-timeline">
              {filteredReports.map((report) => (
                <div key={report._id} className="history-card" style={{ borderLeft: (report.importance === "Important") ? '4px solid var(--accent-warning)' : '1px solid var(--border-color)' }}>
                  <div className="history-header">
                    <div className="history-date">
                      {new Date(report.appointmentDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="history-doctor" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <strong>{report.doctorName}</strong> | {report.hospitalName}
                      <span className={`badge ${(report.importance === "Important") ? "badge-warning" : "badge-success"}`} style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
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
                              {med.notes && <em> ({med.notes})</em>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {report.images && report.images.length > 0 && (
                        <div className="report-images-view">
                          <strong>Attached Images:</strong>
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
                        <strong>Follow-up Date:</strong> {new Date(report.followUpDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-history" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <Empty />
                {filter !== "All" && <button className="btn btn-secondary-outline btn-sm" onClick={() => setFilter("All")}>Clear Filters</button>}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default MedicalHistory;
