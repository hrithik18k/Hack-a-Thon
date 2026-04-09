import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [unreadCount, setUnreadCount] = useState(0);
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

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axios.get("/api/notification/unreadcount", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUnreadCount();
    }
    
    // Listen for custom event to clear unread count
    const handleClearCount = () => setUnreadCount(0);
    window.addEventListener("notifications_read", handleClearCount);
    
    return () => {
      window.removeEventListener("notifications_read", handleClearCount);
    };
  }, [token]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close mobile nav on link click
  const closeNav = useCallback(() => setIconActive(false), []);

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

        {/* Mobile overlay backdrop */}
        {iconActive && (
          <div className="nav-overlay" onClick={closeNav} />
        )}

        <ul className="nav-links">
          <li><NavLink to={"/"} onClick={closeNav}>Home</NavLink></li>

          {user && user.role === "Patient" && (
            <>
              <li><NavLink to={"/doctors"} onClick={closeNav}>Find Doctors</NavLink></li>
              <li><NavLink to={"/appointments"} onClick={closeNav}>My Appointments</NavLink></li>
              <li><NavLink to={"/medical-history"} onClick={closeNav}>Medical History</NavLink></li>
              <li>
                <NavLink to={"/notifications"} onClick={closeNav} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Notifications 
                  {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                </NavLink>
              </li>
              <li><NavLink to={"/profile"} onClick={closeNav}>Profile</NavLink></li>
            </>
          )}

          {user && user.role === "Doctor" && (
            <>
              <li><NavLink to={"/appointments"} onClick={closeNav}>Appointments</NavLink></li>
              <li><NavLink to={"/emergency"} onClick={closeNav}>Emergency</NavLink></li>
              <li>
                <NavLink to={"/notifications"} onClick={closeNav} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Notifications
                  {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                </NavLink>
              </li>
              <li><NavLink to={"/device-setup"} onClick={closeNav}>Device Setup</NavLink></li>
              <li><NavLink to={"/profile"} onClick={closeNav}>Profile</NavLink></li>
            </>
          )}

          {user && user.role === "Admin" && (
            <>
              <li><NavLink to={"/dashboard/home"} onClick={closeNav}>Dashboard</NavLink></li>
            </>
          )}

          {!token ? (
            <>
              <li><NavLink className="btn-secondary" to={"/login"} onClick={closeNav}>Login</NavLink></li>
              <li><NavLink className="btn-primary-outline" to={"/register"} onClick={closeNav}>Register</NavLink></li>
            </>
          ) : (
            <li>
              <button className="btn btn-danger-outline btn-sm nav-logout-btn" onClick={() => { logoutFunc(); closeNav(); }}>Logout</button>
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
