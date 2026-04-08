import React from "react";

const Empty = ({ title = "Nothing to show", message = "There is no data to display at this moment." }) => {
  return (
    <div className="empty-state">
      <div className="empty-illustration">
        <svg
          width="160"
          height="160"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
             d="M100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0Z"
             fill="var(--glass-bg)"
          />
          <path
             d="M136.936 86.4429C139.73 83.2505 139.387 78.4168 136.195 75.6231C133.003 72.8294 128.169 73.1724 125.375 76.3648L89.8722 116.945L74.1954 100.865C71.3093 97.9042 66.5298 97.8038 63.5222 100.64C60.5146 103.477 60.414 108.177 63.2989 111.135L84.8118 133.197C86.3262 134.75 88.4239 135.589 90.6 135.518C92.7762 135.448 94.8055 134.475 96.2081 132.87L136.936 86.4429Z"
             fill="currentColor"
             fillOpacity="0.2"
          />
          <path d="M100 50v40m0 20v2" stroke="currentColor" strokeWidth="12" strokeLinecap="round" opacity="0.3"/>
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="8" strokeDasharray="40 20" strokeLinecap="round" opacity="0.1" />
        </svg>
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
    </div>
  );
};

export default Empty;
