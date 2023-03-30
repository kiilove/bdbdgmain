import React, { createContext, useState } from "react";

export const PromoterContext = createContext();

export const PromoterContextProvider = ({ children }) => {
  const [promoterList, setPromoterList] = useState(null);

  return (
    <PromoterContext.Provider value={{ promoterList, setPromoterList }}>
      {children}
    </PromoterContext.Provider>
  );
};
