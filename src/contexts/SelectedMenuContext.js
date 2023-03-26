import React, { createContext, useState } from "react";

export const SelectedMenuContext = createContext();

export const SelectedMenuProvider = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);

  return (
    <SelectedMenuContext.Provider value={{ selectedMenu, setSelectedMenu }}>
      {children}
    </SelectedMenuContext.Provider>
  );
};
