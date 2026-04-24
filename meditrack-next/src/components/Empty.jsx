"use client";

import PropTypes from 'prop-types';
import React from "react";

const Empty = ({ title = "Nothing to show", message = "There is no data to display at this moment." }) => {
  return (
    <div className="empty-state">
      <div className="empty-illustration">—</div>
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
