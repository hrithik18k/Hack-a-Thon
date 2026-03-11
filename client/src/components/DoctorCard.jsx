import React, { useState } from "react";
import "../styles/doctorcard.css";
import BookAppointment from "../components/BookAppointment";
import toast from "react-hot-toast";

const DoctorCard = ({ ele }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem("token") || "";

  const handleModal = () => {
    if (token === "") {
      return toast.error("You must log in first");
    }
    setModalOpen(true);
  };

  return (
    <>
      <div className={`card`}>
        <div className={`card-img-container`}>
        <img
          src={
            ele?.userId?.pic ||
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
          }
          alt="profile"
        />
      </div>
      <div className="card-details">
        <h3 className="card-name">
          Dr. {ele?.userId?.firstname} {ele?.userId?.lastname}
        </h3>
        <p className="specialization">
          <strong>Specialization: </strong>
          {ele?.specialization}
        </p>
        <p className="experience">
          <strong>Experience: </strong>
          {ele?.experience}yrs
        </p>
        <p className="fees">
          <strong>Fees per consultation: </strong>$ {ele?.fees}
        </p>
        <p className="phone">
          <strong>Phone: </strong>{ele?.userId?.phone}
        </p>
        <p className="hospital">
          <strong>Hospital: </strong>{ele?.hospitalName}
        </p>
        <p className="city">
          <strong>City: </strong>{ele?.city}
        </p>
        <button className="btn appointment-btn" onClick={handleModal}>
          Book Appointment
        </button>
      </div>
      </div>
      {modalOpen && <BookAppointment setModalOpen={setModalOpen} ele={ele} />}
    </>
  );
};

export default DoctorCard;
