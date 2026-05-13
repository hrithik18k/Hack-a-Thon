"use client";

import { Protected } from "../../middleware/route";
import React, { useEffect, useState } from "react";
import { FiChevronDown, FiChevronRight, FiImage, FiRefreshCw, FiX } from "react-icons/fi";
import EditorialShell from "../../components/editorial/EditorialShell";
import Empty from "../../components/Empty";
import Loading from "../../components/Loading";
import fetchData from "../../helper/apiCall";
import toast from "react-hot-toast";

const filters = ["Important", "General", "All"];

const secureUrl = (url) => {
  if (url && url.startsWith("http://res.cloudinary.com")) {
    return url.replace("http://", "https://");
  }
  return url;
};

const MedicalHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const data = await fetchData("/api/report/mine");
        setReports(data || []);
      } catch {
        toast.error("Failed to load your medical history");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const importance = (report.importance || "General").toLowerCase();
    const activeFilter = filter.toLowerCase();
    return activeFilter === "all" ? true : importance === activeFilter;
  });

  return (
    <EditorialShell>
      <main className="editorial-page">
        <section className="editorial-page-hero">
          <div className="editorial-shell">
            <span className="editorial-eyebrow">Patient records</span>
            <h1 className="editorial-page-title">Your medical history is now easier to scan and revisit.</h1>
            <p className="editorial-lede">
              Reports, follow-ups, attachments, and prescribed medications stay grouped into one readable timeline.
            </p>

            <div className="editorial-chip-row">
              {filters.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`editorial-filter-chip ${filter === value ? "is-active" : ""}`}
                  onClick={() => setFilter(value)}
                >
                  {value === "Important" ? "Critical history" : value === "General" ? "Routine visits" : "All records"}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="editorial-section editorial-section-tight">
          <div className="editorial-shell editorial-narrow-shell">
            {loading ? (
              <Loading label="Loading your medical history..." />
            ) : filteredReports.length ? (
              <div className="editorial-history-list">
                {filteredReports.map((report) => {
                  const expanded = expandedId === report._id;

                  return (
                    <article key={report._id} className="editorial-history-item">
                      <button type="button" className="editorial-history-summary" onClick={() => setExpandedId(expanded ? null : report._id)}>
                        <span className="editorial-history-toggle">{expanded ? <FiChevronDown /> : <FiChevronRight />}</span>
                        <span>{new Date(report.appointmentDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                        <strong>{report.doctorName}</strong>
                        <span>{report.diagnosis}</span>
                        <span className={`badge ${report.importance === "Important" ? "badge-warning" : "badge-success"}`}>
                          {report.importance || "General"}
                        </span>
                      </button>

                      {expanded ? (
                        <div className="editorial-history-details">
                          <p><strong>Hospital:</strong> {report.hospitalName}</p>
                          <p><strong>Diagnosis:</strong> {report.diagnosis}</p>
                          {report.notes ? <p><strong>Notes:</strong> {report.notes}</p> : null}

                          {report.medications?.length ? (
                            <div>
                              <strong>Medications</strong>
                              <ul className="editorial-detail-list">
                                {report.medications.map((medication, index) => (
                                  <li key={medication._id || `${index}-${medication.name}`}>
                                    {medication.name} - {medication.dosage}, {medication.frequency} for {medication.duration}
                                    {medication.notes ? ` (${medication.notes})` : ""}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}

                          {report.images?.length ? (
                            <div>
                              <strong>Attachments</strong>
                              <div className="editorial-media-grid">
                                {report.images.map((image, index) => (
                                  <button key={image._id || `${index}-${image}`} type="button" className="editorial-media-thumb" onClick={() => setLightboxImg(secureUrl(image))}>
                                    <img src={secureUrl(image)} alt="Medical record" />
                                    <span><FiImage /> Open image</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {report.followUpDate ? <p><strong>Follow-up:</strong> {new Date(report.followUpDate).toLocaleDateString()}</p> : null}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : (
              <Empty
                title="No records match this filter"
                message="When consultations are completed, your reports will appear here."
                action={filter !== "All" ? (
                  <button type="button" className="editorial-btn editorial-btn-outline" onClick={() => setFilter("All")}>
                    <FiRefreshCw />
                    <span>Show all records</span>
                  </button>
                ) : null}
              />
            )}
          </div>
        </section>
      </main>

      {lightboxImg ? (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)} role="button" tabIndex={0} onKeyDown={(event) => {
          if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
            setLightboxImg(null);
          }
        }}>
          <button className="lightbox-close" onClick={() => setLightboxImg(null)}>
            <FiX />
          </button>
          <img src={lightboxImg} alt="Enlarged medical record" className="lightbox-image" onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </EditorialShell>
  );
};

const ProtectedMedicalHistory = () => <Protected><MedicalHistory /></Protected>;

export default ProtectedMedicalHistory;
