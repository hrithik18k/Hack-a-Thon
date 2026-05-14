"use client";

import PropTypes from 'prop-types';
import React from "react";
import { FiInbox } from "react-icons/fi";

const Empty = ({ title = "Nothing to show", message = "There is no data to display at this moment." }) => {
  return (
    <div className="empty-state">
      <div className="empty-illustration" style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "var(--accent-primary-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1rem"
      }}>
        <FiInbox style={{ fontSize: "2rem", color: "var(--accent-primary)", opacity: 0.7 }} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
    </div>
  );
};

export default Empty;

Empty.propTypes = {
  title: PropTypes.any,
  message: PropTypes.any
};
