import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-hot-toast";

const Emergency = () => {
  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>Emergency Mode</h1>
          <p>This page allows doctors to fetch patient details in emergency situations using their biometric fingerprints.</p>
          <div style={{ marginTop: "2rem" }}>
            <button 
              className="btn" 
              onClick={() => toast("Feature coming soon 🚀", { icon: "👆" })}
              style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}
            >
              Get Patient Fingerprint
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Emergency;
