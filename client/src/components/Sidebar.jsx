import PropTypes from 'prop-types';
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import { FaHome, FaUsers, FaUserMd, FaCalendarCheck, FaSignOutAlt } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <button className="sidebar-close-btn" onClick={onClose} title="Close sidebar">
        <RxCross1 />
      </button>
      <div className="sidebar-title">Admin Panel</div>
      <ul className="sidebar-links">
        <li>
          <NavLink to="/dashboard/home" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleLinkClick}>
            <FaHome /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/users" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleLinkClick}>
            <FaUsers /> Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/doctors" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleLinkClick}>
            <FaUserMd /> Doctors
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/appointments" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleLinkClick}>
            <FaCalendarCheck /> Appointments
          </NavLink>
        </li>
        
        <li className="logout-li">
          <a href="#logout" onClick={(e) => { e.preventDefault(); logoutFunc(); }}>
            <FaSignOutAlt /> Log Out
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  isOpen: PropTypes.any,
  onClose: PropTypes.any
};
