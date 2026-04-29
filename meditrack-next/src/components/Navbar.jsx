"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import { FiMenu, FiSun, FiMoon } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { logoutSession, useAuthSession } from "@/lib/useAuthSession";

axios.defaults.baseURL = getApiBaseUrl();
axios.defaults.withCredentials = true;

const Navbar = () => {
  const [iconActive, setIconActive] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { ready, user } = useAuthSession();

  // Theme toggle
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "light");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axios.get("/api/notification/unreadcount");
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (ready && user) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0);
    }
    
    // Listen for custom event to clear unread count
    const handleClearCount = () => setUnreadCount(0);
    window.addEventListener("notifications_read", handleClearCount);
    
    return () => {
      window.removeEventListener("notifications_read", handleClearCount);
    };
  }, [ready, user]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const logoutFunc = async () => {
    await logoutSession();
    dispatch(setUserInfo({}));
    router.push("/login");
  };

  // Close mobile nav on link click
  const closeNav = useCallback(() => setIconActive(false), []);

  return (
    <header className="navbar-container">
      <nav className={`nav ${iconActive ? "nav-active" : ""}`}>
        <h2 className="nav-logo">
          <Link href={"/"}>MEDI TRACK</Link>
        </h2>

        <div className="menu-icons">
          {!iconActive ? (
            <FiMenu className="menu-open" onClick={() => setIconActive(true)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIconActive(true); }} />
          ) : (
            <RxCross1 className="menu-close" onClick={() => setIconActive(false)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIconActive(false); }} />
          )}
        </div>

        {/* Mobile overlay backdrop */}
        {iconActive && (
          <div className="nav-overlay" onClick={closeNav} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') closeNav(); }} />
        )}

        <ul className="nav-links">
          <li><Link href={"/"} onClick={closeNav}>Home</Link></li>

          {mounted && user?.role === "Patient" && (
            <>
              <li><Link href={"/doctors"} onClick={closeNav}>Find Doctors</Link></li>
              <li><Link href={"/appointments"} onClick={closeNav}>My Appointments</Link></li>
              <li><Link href={"/medical-history"} onClick={closeNav}>Medical History</Link></li>
              <li>
                <Link href={"/notifications"} onClick={closeNav} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Notifications 
                  {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                </Link>
              </li>
              <li><Link href={"/profile"} onClick={closeNav}>Profile</Link></li>
            </>
          )}

          {mounted && user?.role === "Doctor" && (
            <>
              <li><Link href={"/appointments"} onClick={closeNav}>Appointments</Link></li>
              <li><Link href={"/emergency"} onClick={closeNav}>Emergency</Link></li>
              <li>
                <Link href={"/notifications"} onClick={closeNav} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Notifications
                  {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                </Link>
              </li>
              <li><Link href={"/device-setup"} onClick={closeNav}>Device Setup</Link></li>
              <li><Link href={"/profile"} onClick={closeNav}>Profile</Link></li>
            </>
          )}

          {mounted && user?.role === "Admin" && (
            <>
              <li><Link href={"/dashboard/home"} onClick={closeNav}>Dashboard</Link></li>
            </>
          )}

          {mounted && !user ? (
            <>
              <li><Link className="btn-secondary" href={"/login"} onClick={closeNav}>Login</Link></li>
              <li><Link className="btn-primary-outline" href={"/register"} onClick={closeNav}>Register</Link></li>
            </>
          ) : mounted && (
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
