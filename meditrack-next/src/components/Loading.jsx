"use client";

import React from "react";

function Loading() {
  return (
    <div className="loading">
      <div className="loader">Loading</div>
      <span style={{ 
        fontSize: "0.8rem", 
        color: "var(--text-muted)", 
        fontFamily: "var(--font-body)",
        letterSpacing: "0.5px",
        textTransform: "uppercase"
      }}>
        Loading...
      </span>
    </div>
  );
}

export default Loading;
