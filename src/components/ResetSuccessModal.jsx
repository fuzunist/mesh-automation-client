import React from "react";

const ResetSuccessModal = ({ show, onClose }) => {
  if (!show) return null;

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    maxWidth: "1000px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "0 30px",
    marginTop: "20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#6c757d",
    color: "white",
  };

  const h1Style = {
    fontSize: "22px",
    marginBottom: "10px",
    color: "#4CAF50",
    fontWeight: "600",
  };

  const pStyle = {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#6c757d",
    fontWeight: "600",
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h1 style={h1Style}>Sipariş bilgileri ve Kesme bilgileri sıfırlanmıştır.</h1>
        <p style={pStyle}>Yeni siparişlerinizi girebilirsiniz.</p>
        <div>
          <button style={buttonStyle} onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetSuccessModal;
