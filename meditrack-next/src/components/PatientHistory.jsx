"use client";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FiChevronDown, FiChevronRight, FiImage, FiX } from "react-icons/fi";
import fetchData from "../helper/apiCall";
import Loading from "./Loading";
import toast from "react-hot-toast";

const filters = ["Important", "General", "All"];

const secureUrl = (url) => {
  if (url && url.startsWith("http://res.cloudinary.com")) {
    return url.replace("http://", "https://");
  }
  return url;
};

const PatientHistory = ({ patientId, setModalOpen }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const data = await fetchData(`/api/report/patient/${patientId}`);
        setReports(data || []);
      } catch {
        toast.error("Failed to load patient history");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [patientId]);

  const filteredReports = reports.filter((report) => {
    const importance = (report.importance || "General").toLowerCase();
    const activeFilter = filter.toLowerCase();
    return activeFilter === "all" ? true : importance === activeFilter;
  });

  return (
    <>
      <div className="editorial-overlay" role="presentation">
        <div className="editorial-modal-card editorial-modal-card-history">
          <button type="button" className="close-btn" onClick={() => setModalOpen(false)}>
            <FiX />
          </button>

          <div className="editorial-modal-head">
            <span className="editorial-eyebrow">Patient record timeline</span>
            <h2 className="editorial-card-title">Medical history</h2>
            <p>Review critical and routine reports in one expandable summary.</p>
          </div>

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

          {loading ? (
            <Loading label="Loading patient history..." />
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
                        {report.notes ? <p><strong>Notes:</strong> {report.notes}</p> : null}

                        {report.medications?.length ? (
                          <div>
                            <strong>Medications</strong>
                            <ul className="editorial-detail-list">
                              {report.medications.map((medication, index) => (
                                <li key={medication._id || `${index}-${medication.name}`}>
                                  {medication.name} - {medication.dosage}, {medication.frequency} for {medication.duration}
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
            <div className="editorial-empty-state">
              <h3 className="editorial-card-title">No records in this filter</h3>
              <p>Switch to another filter or wait for more reports to be published.</p>
            </div>
          )}
        </div>
      </div>

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
    </>
  );
};

export default PatientHistory;

PatientHistory.propTypes = {
  patientId: PropTypes.any,
  setModalOpen: PropTypes.any,
};
