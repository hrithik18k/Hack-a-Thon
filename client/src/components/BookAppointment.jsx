import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
    reason: "",
    age: "",
    gender: "",
    bloodGroup: "",
  });
  const [loading, setLoading] = useState(false);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const payload = {
        ...formDetails,
        doctorId: ele?.userId?._id,
        doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
      };

      const { data } = await axios.post(
        "/api/appointment/bookappointment",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Appointment booked successfully");
        setModalOpen(false);
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal flex-center">
      <div className="modal-content">
        <button
          type="button"
          className="close-btn"
          onClick={() => setModalOpen(false)}
        >
          <IoMdClose />
        </button>
        <h2 className="modal-title">Book Appointment</h2>
        <p className="modal-subtitle">
          with Dr. {ele?.userId?.firstname} {ele?.userId?.lastname}
        </p>

        <form onSubmit={bookAppointment} className="modal-form">
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={formDetails.date}
              onChange={inputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Time *</label>
            <input
              type="time"
              name="time"
              className="form-input"
              value={formDetails.time}
              onChange={inputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Reason for Visit *</label>
            <input
              type="text"
              name="reason"
              className="form-input"
              value={formDetails.reason}
              onChange={inputChange}
              placeholder="E.g., Checkup, Fever..."
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={formDetails.age}
                onChange={inputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                className="form-input"
                value={formDetails.gender}
                onChange={inputChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                className="form-input"
                value={formDetails.bloodGroup}
                onChange={inputChange}
                placeholder="Optional"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
