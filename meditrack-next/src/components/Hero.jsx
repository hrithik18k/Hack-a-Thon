"use client";

import React from "react";
import Link from "next/link";
import image from "../images/heroimg.jpg";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Your Health, <br />
          In Your Hands.
        </h1>
        <p>
          Connect with top doctors, manage your appointments seamlessly, and keep all your 
          medical records secure in one place. Experience healthcare that prioritizes your 
          well-being.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/doctors" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Find a Doctor
          </Link>
          <Link href="/register" className="btn btn-primary-outline" style={{ textDecoration: "none" }}>
            Get Started
          </Link>
        </div>
      </div>
      <div className="hero-img">
        <img
          src={image.src}
          alt="hero"
        />
      </div>
    </section>
  );
};

export default Hero;
