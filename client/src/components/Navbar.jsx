import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import { FiMenu, FiSun, FiMoon } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import jwtDecode from "jwt-decode";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Navbar = () => {
  const [iconActive, setIconActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  let user = null;
  try {
    if (token) user = jwtDecode(token);
  } catch (e) { }

  // Theme toggle
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar-container">
      <nav className={`nav ${iconActive ? "nav-active" : ""}`}>
        <h2 className="nav-logo">
          <NavLink to={"/"}>Medi track</NavLink>
        </h2>

        <div className="menu-icons">
          {!iconActive ? (
            <FiMenu className="menu-open" onClick={() => setIconActive(true)} />
          ) : (
            <RxCross1 className="menu-close" onClick={() => setIconActive(false)} />
          )}
        </div>

        <ul className="nav-links">
          <li><NavLink to={"/"}>Home</NavLink></li>

          {user && user.role === "Patient" && (
            <>
              <li><NavLink to={"/doctors"}>Find Doctors</NavLink></li>
              <li><NavLink to={"/appointments"}>My Appointments</NavLink></li>
              <li><NavLink to={"/medical-history"}>Medical History</NavLink></li>
              <li><NavLink to={"/notifications"}>Notifications</NavLink></li>
              <li><NavLink to={"/profile"}>Profile</NavLink></li>
            </>
          )}

          {user && user.role === "Doctor" && (
            <>
              <li><NavLink to={"/appointments"}>Appointments</NavLink></li>
              <li><NavLink to={"/emergency"}>Emergency</NavLink></li>
              <li><NavLink to={"/notifications"}>Notifications</NavLink></li>
              <li><NavLink to={"/profile"}>Profile</NavLink></li>
            </>
          )}

          {user && user.role === "Admin" && (
            <>
              <li><NavLink to={"/dashboard/home"}>Dashboard</NavLink></li>
            </>
          )}

          {!token ? (
            <div className="auth-buttons">
              <li><NavLink className="btn-secondary" to={"/login"}>Login</NavLink></li>
              <li><NavLink className="btn-primary-outline" to={"/register"}>Register</NavLink></li>
            </div>
          ) : (
            <li>
              <button className="btn btn-danger-outline btn-sm nav-logout-btn" onClick={logoutFunc}>Logout</button>
            </li>
          )}

          <li>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
