import React from "react";
import "./loading.css"; // Import the specific CSS for the Loading component

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loading;