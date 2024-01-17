import React from "react";

const UploadSuccessModal = ({ show, onClose, count, failedRows }) => {
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
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "1000px",
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
    backgroundColor: "#6c757d",
    color: "white",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  };

  const thStyle = {
    borderBottom: "1px solid #ddd",
    padding: "18px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
    fontWeight: "bold"
  };

  const tdStyle = {
    borderBottom: "1px solid #ddd",
    padding: "18px",
    textAlign: "left"
  };

  const tableContainerStyle = {
    overflowX: "auto", // Enable horizontal scrolling
    marginTop: "0px",
  };

  const h1Style = {
    fontSize: "28px", // Adjust the font size as needed
    marginBottom: "10px", // Space below the header
    color: "green",
    fontWeight: "semibold"
  };

  const pStyle = {
    fontSize: "22px", // Adjust the font size as needed
    marginBottom: "0px", // Space below the paragraph
    marginTop: "30px",
    color: "red",
  };

  const h4Style = {
    fontSize: "22px", // Adjust the font size as needed
    marginBottom: "0px", // Space below the header
    color: "green",
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h4 style={h4Style}>Excel yüklemesi tamamlandı.</h4>
        <h1 style={h1Style}>{count} satır başarılı şekilde yüklendi</h1>
  
        {failedRows && failedRows.length > 0 && (
          <>
            <p style={pStyle}>Yüklenemeyen Satırlar:</p>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Satır Numarası</th>
                    <th style={thStyle}>Hasır Tipi</th>
                    <th style={thStyle}>Hasır Kodu</th>
                    <th style={thStyle}>Hasır Adı</th>
                    <th style={thStyle}>Hasır Boyu</th>
                    <th style={thStyle}>Hasır Eni</th>
                    <th style={thStyle}>Sipariş Adedi</th>
                  </tr>
                </thead>
                <tbody>
                  {failedRows.map(({ index, row }) => (
                    <tr key={index}>
                      <td style={tdStyle}>{index}</td>
                      <td style={tdStyle}>{row["Hasır Tipi"]}</td>
                      <td style={tdStyle}>{row["Hasır Kodu"]}</td>
                      <td style={tdStyle}>{row["Hasır Adı"]}</td>
                      <td style={tdStyle}>{row["Hasır Boyu"]}</td>
                      <td style={tdStyle}>{row["Hasır Eni"]}</td>
                      <td style={tdStyle}>{row["Sipariş Adedi"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
  
        <div style={{ marginTop: "20px" }}>
          <button style={buttonStyle} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
  
  
};


export default UploadSuccessModal;
