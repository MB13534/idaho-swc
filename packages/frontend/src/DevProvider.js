import React, { useState, useContext } from "react";

export const DevContext = React.createContext();
export const useDev = () => useContext(DevContext);

export const DevProvider = ({ children }) => {
  // Raw API Data
  const [rawApiData, setRawApiData] = useState(null);

  return (
    <DevContext.Provider
      value={{
        rawApiData,
        setRawApiData,
      }}
    >
      {children}
    </DevContext.Provider>
  );
};
