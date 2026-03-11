import React from "react";
import image from "../images/heroimg.jpg";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Modern Enterprise <br />
          Doctor-Patient Appointment System
        </h1>
        <p>
          Empowering patients with full control over their medical history and
          appointments. Delivering seamless digital healthcare and robust
          administrative tools for medical professionals.
        </p>
      </div>
      <div className="hero-img">
        <img
          src={image}
          alt="hero"
        />
      </div>
    </section>
  );
};

export default Hero;
