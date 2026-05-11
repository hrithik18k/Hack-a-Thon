"use client";

import React from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer">
          <div className="footer-brand">
            <h3 style={{ 
              fontSize: "1.1rem", 
              letterSpacing: "2px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "0.75rem"
            }}>
              <span style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "var(--accent-gradient)",
                display: "inline-block",
                boxShadow: "0 0 12px rgba(99, 102, 241, 0.4)"
              }}></span>
              MEDI TRACK
            </h3>
            <p style={{ fontSize: "0.85rem", maxWidth: "280px", lineHeight: "1.6" }}>
              Your trusted healthcare companion. Connecting patients with top doctors for a healthier tomorrow.
            </p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link href={"/"}>Home</Link>
              </li>
              <li>
                <Link href={"/doctors"}>Doctors</Link>
              </li>
              <li>
                <Link href={"/appointments"}>Appointments</Link>
              </li>
              <li>
                <Link href={"/notifications"}>Notifications</Link>
              </li>
              <li>
                <Link href={"/#contact"}>Contact Us</Link>
              </li>
              <li>
                <Link href={"/profile"}>Profile</Link>
              </li>
            </ul>
          </div>
          <div className="social">
            <h3>Follow Us</h3>
            <ul>
              <li className="facebook">
                <a
                  href="https://www.facebook.com/"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <FaFacebookF />
                </a>
              </li>
              <li className="youtube">
                <a
                  href="https://www.youtube.com/"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <FaYoutube />
                </a>
              </li>
              <li className="instagram">
                <a
                  href="https://www.instagram.com/"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <FaInstagram />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Medi Track. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
