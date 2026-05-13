"use client";

import React, { useEffect, useState } from "react";
import DoctorCard from "../../components/DoctorCard";
import fetchData from "../../helper/apiCall";
import Loading from "../../components/Loading";
import Empty from "../../components/Empty";
import EditorialShell from "../../components/editorial/EditorialShell";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ city: "", specialization: "" });

  const fetchAllDocs = async () => {
    try {
      setIsLoading(true);
      const query = new URLSearchParams(filters).toString();
      // Even if public access, depending on apiCall it sends token if exists.
      // But we should use axios directly if user is not logged in.
      const url = `/api/doctor/getalldoctors${query ? `?${query}` : ''}`;
      const data = await fetchData(url);
      setDoctors(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <EditorialShell>
      <main className="editorial-page">
        <section className="editorial-page-hero">
          <div className="editorial-shell">
            <span className="editorial-eyebrow">Patient discovery</span>
            <h1 className="editorial-page-title">Find the right specialist without leaving the care workflow.</h1>
            <p className="editorial-lede">
              Search the approved doctor network by city and specialization, then move directly into booking from the same interface.
            </p>

            <div className="editorial-filter-bar">
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Filter by city"
                className="editorial-input"
              />
              <input
                type="text"
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                placeholder="Filter by specialization"
                className="editorial-input"
              />
            </div>
          </div>
        </section>

        <section className="editorial-section editorial-section-tight">
          <div className="editorial-shell">
            {isLoading ? (
              <Loading />
            ) : doctors?.length > 0 ? (
              <div className="editorial-doctor-grid">
                {doctors.map((ele) => (
                  <DoctorCard ele={ele} key={ele._id} />
                ))}
              </div>
            ) : (
              <Empty title="No doctors found" message="Try a different city or specialization filter." />
            )}
          </div>
        </section>
      </main>
    </EditorialShell>
  );
};

export default Doctors;
