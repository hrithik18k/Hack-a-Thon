import React, { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/doctors.css";
import fetchData from "../helper/apiCall";
import Loading from "../components/Loading";
import Empty from "../components/Empty";

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
    <>
      <Navbar />
      <section className="doctors-section">
        <div className="container">
          <div className="doctors-header">
            <h2 className="page-title">Find a Doctor</h2>
            <div className="filters-container">
              <input 
                type="text" 
                name="city" 
                value={filters.city} 
                onChange={handleFilterChange} 
                placeholder="Search by City..." 
                className="filter-input"
              />
            </div>
          </div>
          
          {isLoading ? (
            <Loading />
          ) : doctors?.length > 0 ? (
            <div className="doctors-card-container">
              {doctors.map((ele) => (
                <DoctorCard ele={ele} key={ele._id} />
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

export default Doctors;
