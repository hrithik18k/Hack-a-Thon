import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fetchData from "../helper/apiCall";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import "../styles/patienthistory.css";
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

  return (
    <>
      <Navbar />
      <section className="appts-section">
        <div className="container">
          <h2 className="page-title">My Medical History</h2>
          
          {loading ? (
            <Loading />
          ) : reports.length > 0 ? (
            <div className="history-timeline" style={{ marginTop: '2rem' }}>
              {reports.map((report) => (
                <div key={report._id} className="history-card">
                  <div className="history-header">
                    <div className="history-date">
                      {new Date(report.appointmentDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
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
                              {med.notes && <em> ({med.notes})</em>}
                            </li>
                          ))}
                        </ul>
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
            <Empty />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default MedicalHistory;
