const Modal = ({
    showModal,
    setShowModal,
    optimizedValues,
    extraWidthLengthUsed,
    initialValues,
    onConfirm,
  }) => {
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
    };
  
    const modalContentStyle = {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      maxWidth: "600px",
      maxHeight: "80%",
      overflowY: "auto",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    };
  
    const buttonStyle = {
      padding: "10px 20px",
      margin: "10px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#007bff",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold",
    };
  
    return (
      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <h2 style={{ fontWeight: "bold", marginBottom: "15px" }}>Birleştirme Sonuçları</h2>
          
          <p style={{ marginBottom: "10px", fontWeight: "light" }}>
            Birleştirme yapmadan önce seçmiş olduğunuz çubuk sayılarınız şu şekildedir:
          </p>
  
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            {initialValues.map((value, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                <strong>En Çubuğu Uzunluğu:</strong> {value[0]}cm, <strong>Adet:</strong> {value[1]}
              </li>
            ))}
          </ul>
  
          <p style={{ marginBottom: "10px", fontWeight: "light" }}>
            Bu birleştirmeyi yaparsanız, işlem şu şekilde olacak:
          </p>
  
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            {optimizedValues.map((value, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                <strong>En Çubuğu Uzunluğu:</strong> {value[0] + "cm"}, <strong>Adet:</strong> {value[1]}
              </li>
            ))}
          </ul>
  
          <p style={{ marginBottom: "20px" }}><strong>Fazla Üretim:</strong> {extraWidthLengthUsed} cm</p>
  
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button style={buttonStyle} onClick={() => setShowModal(false)}>Kapat</button>
            <button style={{ ...buttonStyle, backgroundColor: "#28a745" }} onClick={onConfirm}>
              Bu birleştirmeyi onayla
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  