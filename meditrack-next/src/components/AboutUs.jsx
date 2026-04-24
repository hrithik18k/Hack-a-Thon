"use client";

import React from "react";
import image from "../images/aboutimg.jpg";

const AboutUs = () => {
  return (
    <>
      <section className="container">
        <h2 className="page-heading about-heading">About Us</h2>
        <div className="about">
          <div className="hero-img">
            <img
              src={image.src}
              alt="hero"
            />
          </div>
          <div className="hero-content">
            <p>
              We believe that everyone deserves easy and transparent access to healthcare. 
              Our platform bridges the gap between doctors and patients by providing a unified, 
              stress-free appointment ecosystem. Whether you're looking for a specialist in your city 
              or simply want to keep an organized history of your medical records securely, 
              we are here for you. We also empower medical professionals to seamlessly manage 
              their appointments so they can focus entirely on what they do best: patient care.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
