import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const fetchSlots = async (selectedDate) => {
    if (!selectedDate || !ele?.userId?._id) return;
    setSlotsLoading(true);
    try {
      const response = await axios.get(
        `/api/appointment/getavailableslots?doctorId=${ele.userId._id}&date=${selectedDate}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.data.success) {
        setAvailableSlots(response.data.data);
      }
    } catch (err) {
      toast.error("Could not fetch available slots");
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (formDetails.date) {
      fetchSlots(formDetails.date);
      setFormDetails((prev) => ({ ...prev, time: "" })); // clear time on date change
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDetails.date]);

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
            <label>Time Slot *</label>
            {slotsLoading ? (
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Loading slots...</p>
            ) : !formDetails.date ? (
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Please select a date first</p>
            ) : availableSlots.length === 0 ? (
              <p style={{ fontSize: "0.9rem", color: "var(--text-danger)" }}>No slots available</p>
            ) : (
              <div className="slots-grid" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {availableSlots.map((slot) => {
                  const isPast = new Date(`${formDetails.date}T${slot.time}`) < new Date();
                  const disabled = slot.isBooked || isPast;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={disabled}
                      onClick={() => setFormDetails({ ...formDetails, time: slot.time })}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: formDetails.time === slot.time ? "2px solid var(--accent-primary)" : "1px solid var(--border-color)",
                        background: disabled ? "var(--bg-layer)" : formDetails.time === slot.time ? "var(--accent-primary-light)" : "var(--bg-surface)",
                        color: disabled ? "var(--text-muted)" : "var(--text-primary)",
                        cursor: disabled ? "not-allowed" : "pointer",
                        textDecoration: slot.isBooked ? "line-through" : "none"
                      }}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
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

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
