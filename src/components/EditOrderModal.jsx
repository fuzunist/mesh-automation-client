import React from "react";

const EditOrderModal = ({ show, onClose }) => {  if (!show) return null;

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
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#6c757d",
    color: "white",
    marginTop: "40px",
  };



  const h1Style = {
    fontSize: "22px",
    marginBottom: "10px",
    color: "#6c757d",
    fontWeight: 600,
  };

  const pStyle = {
    fontSize: "22px", // Adjust the font size as needed
    marginBottom: "0px", // Space below the paragraph
    marginTop: "10px",
    color: "black",
  };

  const h4Style = {
    fontSize: "22px", // Adjust the font size as needed
    marginBottom: "0px", // Space below the header
    color: "green",
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        
      <h1  style={h1Style}>
          1 satır seçtiniz. 
         
        </h1>
        
        <h1  style={h1Style}>
           Seçtiğiniz satırı düzenlemek için lütfen sol üsttteki 
         
        </h1>
        <h1  style={h1Style}>
          'Otomatik Hesapla' bölümüne gidiniz.
         
        </h1>
        
        <div style={{ marginTop: "20px" }}>
          <button style={buttonStyle} onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
  
  
};


export default EditOrderModal;
