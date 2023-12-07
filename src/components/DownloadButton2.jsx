import React from "react";

const DownloadButton = ({ downloadAsPdf }) => {
  return (
    <button
      onClick={downloadAsPdf}
      style={{
        marginTop: "10px",
        padding: "12px 18px",
        border: "none",
        backgroundColor: "black",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        transition: "background-color 0.3s",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#003875")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#0056b3")}
    >
      PDF İndir
    </button>
  );
};

export default DownloadButton;
