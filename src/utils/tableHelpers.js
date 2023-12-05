
export const handleDeleteRow = (setFunction, index) => {
    setFunction((prevCalculations) => prevCalculations.filter((_, idx) => idx !== index));
  };
  