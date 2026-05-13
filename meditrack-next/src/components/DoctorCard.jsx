"use client";

import PropTypes from 'prop-types';
import React, { useState } from "react";
import BookAppointment from "../components/BookAppointment";
import toast from "react-hot-toast";
import { useAuthSession } from "@/lib/useAuthSession";
import { FiArrowRight, FiMapPin, FiPhone } from "react-icons/fi";

const DoctorCard = ({ ele }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { ready, user } = useAuthSession();

  const handleModal = () => {
    if (!ready || !user) {
      return toast.error("You must log in first");
    }
    setModalOpen(true);
  };

  return (
    <>
      <article className="editorial-doctor-card">
        <div className="editorial-doctor-media">
          <img
            src={
              ele?.userId?.pic ||
              "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            }
            alt={`Dr. ${ele?.userId?.firstname || ""} ${ele?.userId?.lastname || ""}`}
          />
        </div>
        <div className="editorial-doctor-body">
          <div className="editorial-doctor-topline">
            <span>{ele?.specialization || "General Medicine"}</span>
            <strong>${ele?.fees || 0}</strong>
          </div>
          <h3>
            Dr. {ele?.userId?.firstname} {ele?.userId?.lastname}
          </h3>
          <p className="editorial-doctor-subline">{ele?.hospitalName || "Hospital unavailable"}</p>

          <div className="editorial-doctor-meta">
            <span>
              <FiMapPin />
              {ele?.city || "City unavailable"}
            </span>
            <span>
              <FiPhone />
              {ele?.userId?.phone || "No phone listed"}
            </span>
          </div>

          <div className="editorial-doctor-footer">
            <small>{ele?.experience || 0} years experience</small>
            <button type="button" className="editorial-btn editorial-btn-primary" onClick={handleModal}>
              <span>Book visit</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </article>
      {modalOpen && <BookAppointment setModalOpen={setModalOpen} ele={ele} />}
    </>
  );
};

export default DoctorCard;

DoctorCard.propTypes = {
  ele: PropTypes.any
};
