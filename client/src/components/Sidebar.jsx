import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import { FaHome, FaUsers, FaUserMd, FaCalendarCheck, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Admin Panel</div>
      <ul className="sidebar-links">
        <li>
          <NavLink to="/dashboard/home" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaHome /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/users" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaUsers /> Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/doctors" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaUserMd /> Doctors
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/appointments" className={({ isActive }) => (isActive ? "active" : "")}>
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
