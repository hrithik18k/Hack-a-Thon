import React from "react";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Secure IoT Health <br />
          Records & Smart Medical Dispensing
        </h1>
        <p>
          Empowering patients with full data control through R305 Biometric
          fingerprint authentication and OTP. Enjoy cross-hospital interoperability
          and automated pharmacy smart dispensing for elderly care.
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
