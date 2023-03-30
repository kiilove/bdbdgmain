import React, { createContext, useState } from "react";

export const JudgeContext = createContext();

export const JudgeContextProvider = ({ children }) => {
  const [judgeList, setJudgeList] = useState(null);

  return (
    <JudgeContext.Provider value={{ judgeList, setJudgeList }}>
      {children}
    </JudgeContext.Provider>
  );
};
