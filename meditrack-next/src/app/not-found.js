"use client";

import React from "react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="error container">
      <h2>Error! Page Not Found</h2>
      <Link
        href={"/"}
        className="btn"
      >
        go to home
      </Link>
    </div>
  );
};

export default ErrorPage;
