import * as XLSX from 'xlsx';




export const handleDeleteRow = (setFunction, index) => {
    setFunction((prevCalculations) => prevCalculations.filter((_, idx) => idx !== index));
  };


export  const parseToFloat = (value) => {
    if (value === null || value === undefined) {
      return null;
    }
  
    const trimmedValue = value.toString().trim();
  
    if (trimmedValue === '') {
      return 0;
    }
  
    const standardizedValue = trimmedValue.replace(',', '.');
    return parseFloat(standardizedValue);
  };





  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
  
      if (json.length > 0) {
        // Assuming the first row in Excel corresponds to the input fields
        const firstRow = json[0];
        setMesh({
          type: firstRow['Hasır Tipi (Mesh Type)'],
          code: firstRow['Hasır Kodu (Mesh Code)'],
          name: firstRow['Hasır Adı (Mesh Name)'],
          height: firstRow['Hasır Boyu (Mesh Height)'],
          width: firstRow['Hasır Eni (Mesh Width)'],
          numberOfHeightBars: firstRow['Boy Çubuğu +/- (Number of Height Bars)'],
          numberOfWidthBars: firstRow['En Çubuğu +/- (Number of Width Bars)'],
          piece: firstRow['Sipariş Adedi (Order Quantity)'],
        });
        
        // Automatically trigger the Send Order action
        handleSendOrder();
      }
    };
    reader.readAsArrayBuffer(file);
  };
  
  