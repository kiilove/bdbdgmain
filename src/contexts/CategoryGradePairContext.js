import React, { createContext, useState } from "react";

export const CategoryGradePairContext = createContext();

export const CategoryGradePairProvider = ({ children }) => {
  const [categoryGradePair, setCategoryGradePair] = useState(null);

  return (
    <CategoryGradePairContext.Provider
      value={{ categoryGradePair, setCategoryGradePair }}
    >
      {children}
    </CategoryGradePairContext.Provider>
  );
};
