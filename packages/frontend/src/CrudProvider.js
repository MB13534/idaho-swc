import React, { useState, useContext, useEffect } from "react";
import { ROUTES } from "./constants";

export const CrudContext = React.createContext();
export const useCrud = () => useContext(CrudContext);

export const CrudProvider = ({ children }) => {
  // Current Model Scope
  const [currentModel, setCurrentModel] = useState(null);

  const getModelBasePath = () => `${ROUTES.MODELS}/${currentModel}`;

  useEffect(() => {
    const path = window.location.pathname;
    // will find model name in path like /models/contacts/add or /models/contacts
    let regex = /\/models\/(.+)\//;
    if ((path.match(/\//g) || []).length === 2) {
      regex = /\/models\/(.+)/;
    }
    let model = path.match(regex)[1];

    setCurrentModel(model);
  }, []);

  return (
    <CrudContext.Provider
      value={{
        currentModel,
        setCurrentModel,
        getModelBasePath,
      }}
    >
      {children}
    </CrudContext.Provider>
  );
};
