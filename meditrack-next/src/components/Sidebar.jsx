"use client";

import PropTypes from 'prop-types';
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import { FaHome, FaUsers, FaUserMd, FaCalendarCheck, FaSignOutAlt } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    router.push("/login");
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
          <Link href="/dashboard/home" className={pathname === "/dashboard/home" ? "active" : ""} onClick={handleLinkClick}>
            <FaHome /> Dashboard
          </Link>
        </li>
        <li>
          <Link href="/dashboard/users" className={pathname === "/dashboard/users" ? "active" : ""} onClick={handleLinkClick}>
            <FaUsers /> Users
          </Link>
        </li>
        <li>
          <Link href="/dashboard/doctors" className={pathname === "/dashboard/doctors" ? "active" : ""} onClick={handleLinkClick}>
            <FaUserMd /> Doctors
          </Link>
        </li>
        <li>
          <Link href="/dashboard/appointments" className={pathname === "/dashboard/appointments" ? "active" : ""} onClick={handleLinkClick}>
            <FaCalendarCheck /> Appointments
          </Link>
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
