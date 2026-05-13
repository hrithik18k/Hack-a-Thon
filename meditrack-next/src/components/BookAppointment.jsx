"use client";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiArrowRight, FiCalendar, FiClock, FiFileText, FiX } from "react-icons/fi";

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    async function fetchSlots(selectedDate) {
      if (!selectedDate || !ele?.userId?._id) {
        return;
      }

      setSlotsLoading(true);
      try {
        const response = await axios.get(`/api/appointment/getavailableslots?doctorId=${ele.userId._id}&date=${selectedDate}`);
        if (response.data.success) {
          setAvailableSlots(response.data.data);
        }
      } catch {
        toast.error("Could not fetch available slots");
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }

    if (formDetails.date) {
      fetchSlots(formDetails.date);
      setFormDetails((prev) => ({ ...prev, time: "" }));
    }
  }, [formDetails.date, ele?.userId?._id]);

  const inputChange = (event) => {
    const { name, value } = event.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const bookAppointment = async (event) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formDetails,
        doctorId: ele?.userId?._id,
        doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
      };

      const { data } = await axios.post("/api/appointment/bookappointment", payload);
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
    <div className="editorial-overlay" role="presentation">
      <div className="editorial-modal-card editorial-modal-card-wide">
        <button type="button" className="close-btn" onClick={() => setModalOpen(false)}>
          <FiX />
        </button>

        <div className="editorial-modal-head">
          <span className="editorial-eyebrow">Consultation booking</span>
          <h2 className="editorial-card-title">Book an appointment with Dr. {ele?.userId?.firstname} {ele?.userId?.lastname}</h2>
          <p>Select a date, confirm a live available slot, and share the reason for the visit.</p>
        </div>

        <form onSubmit={bookAppointment} className="editorial-stack">
          <div className="editorial-form-grid">
            <div className="form-field">
              <label className="editorial-label" htmlFor="book-date">Date</label>
              <div className="editorial-input-wrap">
                <FiCalendar />
                <input id="book-date" type="date" name="date" className="editorial-input" value={formDetails.date} onChange={inputChange} required />
              </div>
            </div>

            <div className="form-field">
              <label className="editorial-label">Available time</label>
              {slotsLoading ? <p className="editorial-helper-text">Checking live availability...</p> : null}
              {!formDetails.date && !slotsLoading ? <p className="editorial-helper-text">Choose a date to load slots.</p> : null}
              {formDetails.date && !slotsLoading && !availableSlots.length ? <p className="editorial-helper-text is-danger">No slots available for this date.</p> : null}
              {availableSlots.length ? (
                <div className="editorial-slot-grid">
                  {availableSlots.map((slot) => {
                    const isPast = new Date(`${formDetails.date}T${slot.time}`) < new Date();
                    const disabled = slot.isBooked || isPast;
                    const selected = formDetails.time === slot.time;

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        className={`editorial-slot-chip ${selected ? "is-selected" : ""}`}
                        disabled={disabled}
                        onClick={() => setFormDetails((prev) => ({ ...prev, time: slot.time }))}
                      >
                        <FiClock />
                        <span>{slot.time}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          <div className="form-field">
            <label className="editorial-label" htmlFor="visit-reason">Reason for visit</label>
            <div className="editorial-input-wrap is-textarea">
              <FiFileText />
              <textarea
                id="visit-reason"
                name="reason"
                className="editorial-input editorial-textarea"
                value={formDetails.reason}
                onChange={inputChange}
                placeholder="Describe symptoms, follow-up needs, or the type of consultation."
                rows={4}
                required
              />
            </div>
          </div>

          <div className="editorial-action-row editorial-action-row-end">
            <button type="button" className="editorial-btn editorial-btn-outline" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="editorial-btn editorial-btn-primary" disabled={loading}>
              <span>{loading ? "Booking..." : "Confirm booking"}</span>
              {!loading ? <FiArrowRight /> : null}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;

BookAppointment.propTypes = {
  setModalOpen: PropTypes.any,
  ele: PropTypes.any,
};
