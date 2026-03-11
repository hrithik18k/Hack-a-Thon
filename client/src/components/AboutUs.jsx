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
              src={image}
              alt="hero"
            />
          </div>
          <div className="hero-content">
            <p>
              This enterprise platform bridges the gap between doctors and patients
              by providing a unified, seamless appointment ecosystem. Patients can
              discover specialists by city and specialization, securely schedule visits,
              and maintain an organized, chronological record of their medical history.
              Medical professionals can effortlessly manage their schedule, access patient
              history, and record post-consultation reports all within a clean,
              modern interface.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
