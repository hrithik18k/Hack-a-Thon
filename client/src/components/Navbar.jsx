import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { HashLink } from "react-router-hash-link";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import { FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import jwtDecode from "jwt-decode";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Navbar = () => {
  const [iconActive, setIconActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const user = token ? jwtDecode(token) : null;

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header>
      <nav className={iconActive ? "nav-active" : ""}>
        <h2 className="nav-logo">
          <NavLink to={"/"}>IoT Health Records</NavLink>
        </h2>
        <ul className="nav-links">
          <li>
            <NavLink to={"/"}>Home</NavLink>
          </li>

          {/* Doctor links */}
          {user && user.role === "Doctor" && (
            <>
              <li><NavLink to={"/appointments"}>Appointments</NavLink></li>
              <li><NavLink to={"/prescriptions"}>Prescriptions</NavLink></li>
              <li><NavLink to={"/access-logs"}>Patient Access</NavLink></li>
              <li><NavLink to={"/notifications"}>Notifications</NavLink></li>
              <li><NavLink to={"/pharmacy"}>Pharmacy</NavLink></li>
              <li><NavLink to={"/smart-dispenser"}>Dispensers</NavLink></li>
              <li><NavLink to={"/profile"}>Profile</NavLink></li>
            </>
          )}

          {/* Patient links */}
          {user && user.role === "Patient" && (
            <>
              <li><NavLink to={"/doctors"}>Doctors</NavLink></li>
              <li><NavLink to={"/medical-records"}>My Records</NavLink></li>
              <li><NavLink to={"/prescriptions"}>Prescriptions</NavLink></li>
              <li><NavLink to={"/access-logs"}>Access Logs</NavLink></li>
              <li><NavLink to={"/appointments"}>Appointments</NavLink></li>
              <li><NavLink to={"/smart-dispenser"}>My Dispenser</NavLink></li>
              <li><NavLink to={"/notifications"}>Notifications</NavLink></li>
              <li><NavLink to={"/profile"}>Profile</NavLink></li>
            </>
          )}

          {/* Pharmacist links */}
          {user && user.role === "Pharmacist" && (
            <>
              <li><NavLink to={"/pharmacy"}>Pharmacy</NavLink></li>
              <li><NavLink to={"/access-logs"}>Patient Access</NavLink></li>
              <li><NavLink to={"/notifications"}>Notifications</NavLink></li>
              <li><NavLink to={"/profile"}>Profile</NavLink></li>
            </>
          )}

          {!token ? (
            <>
              <li><NavLink className="btn" to={"/login"}>Login</NavLink></li>
              <li><NavLink className="btn" to={"/register"}>Register</NavLink></li>
            </>
          ) : (
            <li>
              <span className="btn" onClick={logoutFunc}>Logout</span>
            </li>
          )}
        </ul>
      </nav>
      <div className="menu-icons">
        {!iconActive && (
          <FiMenu className="menu-open" onClick={() => setIconActive(true)} />
        )}
        {iconActive && (
          <RxCross1 className="menu-close" onClick={() => setIconActive(false)} />
        )}
      </div>
    </header>
  );
};

export default Navbar;
