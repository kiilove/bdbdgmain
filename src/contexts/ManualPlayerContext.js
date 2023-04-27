import React, { createContext, useState } from "react";

export const ManualPlayerContext = createContext();

export const ManualPlayerContextProvider = ({ children }) => {
  const [manualPlayerList, setManualPlayerList] = useState(null);

  return (
    <ManualPlayerContext.Provider
      value={{ manualPlayerList, setManualPlayerList }}
    >
      {children}
    </ManualPlayerContext.Provider>
  );
};
