import React, { createContext, useState, useContext } from 'react';

const EditOrderContext = createContext();

export const EditOrderProvider = ({ children }) => {
  const [editOrder, setEditOrder] = useState('1');
  const [activeTab, setActiveTab] = useState('1'); // Default to the first tab

  console.log("Providing context - editOrder:", editOrder, "activeTab:", activeTab);


  return (
    <EditOrderContext.Provider value={{ editOrder, setEditOrder, activeTab, setActiveTab }}>
      {children}
    </EditOrderContext.Provider>
  );
};

export const useActivetab = () => useContext(EditOrderContext);
