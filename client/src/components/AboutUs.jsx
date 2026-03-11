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
              This project addresses critical healthcare challenges including fragmented patient
              records, medication errors, and elderly patient medication management through an
              integrated IoT-enabled platform combining secure data management with intelligent
              automation. Cross-hospital interoperability enables seamless information exchange,
              while hardware-controlled medicine dispensers address elderly care challenges,
              significantly improving medication compliance.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
