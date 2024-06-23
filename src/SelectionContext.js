import React, { createContext, useContext, useState } from 'react';

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selectedNodes, setSelectedNodes] = useState([]);

  const addSelectedNodes = (ids) => {
    setSelectedNodes((prevSelected) => [...new Set([...prevSelected, ...ids])]);
  };

  const removeSelectedNodes = (ids) => {
    setSelectedNodes((prevSelected) => prevSelected.filter((id) => !ids.includes(id)));
  };

  return (
    <SelectionContext.Provider value={{ selectedNodes, addSelectedNodes, removeSelectedNodes }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);
