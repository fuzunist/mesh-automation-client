import React from "react";

const ModalRowDeletion = ({ showModal, setShowModal, onConfirm }) => {
  if (!showModal) return null;

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
    zIndex: 1000, // Ensure it's above other elements
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "0 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const confirmButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#dc3545",
    color: "white",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    color: "white",
  };

  return (
    <div style={modalStyle} onClick={() => setShowModal(false)}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h3>Bu satırı silmek istediğinize emin misiniz?</h3>
        <p>(Satır silindikten sonra geri alınamaz)</p>
        <div style={{ marginTop: "20px" }}>
          <button
            style={cancelButtonStyle}
            onClick={() => setShowModal(false)}
          >
            İptal Et
          </button>
          <button
            style={confirmButtonStyle}
            onClick={() => {
              onConfirm();
              setShowModal(false);
            }}
          >
            Satırı Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRowDeletion;
