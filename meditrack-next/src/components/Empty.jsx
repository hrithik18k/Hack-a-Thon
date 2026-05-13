"use client";

import PropTypes from "prop-types";
import React from "react";
import { FiInbox } from "react-icons/fi";

const Empty = ({
  title = "Nothing to review yet",
  message = "This section will populate as soon as new care activity is available.",
  action = null,
}) => {
  return (
    <div className="editorial-empty-state">
      <div className="editorial-empty-icon" aria-hidden="true">
        <FiInbox />
      </div>
      <h3 className="editorial-card-title">{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
};

export default Empty;

Empty.propTypes = {
  title: PropTypes.any,
  message: PropTypes.any,
  action: PropTypes.node,
};
