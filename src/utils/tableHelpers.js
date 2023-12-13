
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
  