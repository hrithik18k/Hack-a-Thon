"use client";

import React from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer">
          <div className="footer-links">
            <h3>Links</h3>
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
            <h3>Social links</h3>
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
          Copy Right
          © {new Date().getFullYear()}
        </div>
      </footer>
    </>
  );
};

export default Footer;
