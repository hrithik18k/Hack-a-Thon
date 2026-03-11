import React from "react";
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
