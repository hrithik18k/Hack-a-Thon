"use client";

import React from "react";

function Loading({ label = "Preparing your care workspace..." }) {
  return (
    <div className="editorial-loading">
      <div className="loader">Loading</div>
      <span className="editorial-loading-label">{label}</span>
    </div>
  );
}

export default Loading;
