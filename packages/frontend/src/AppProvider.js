import React, { useState, useContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const AppContext = React.createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // User
  const { user } = useAuth0();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (user) {
      let myUser = { ...user };
      const roles = myUser[`${process.env.REACT_APP_AUDIENCE}/roles`];

      // TODO: dkulak: make this use real users once user section is done
      myUser.id = "af400afa-6247-4313-9d8a-738a3633db83";

      if (roles && roles.filter((x) => x === "Administrator").length > 0) {
        myUser.isAdmin = true;
      } else {
        myUser.isAdmin = false;
      }

      if (roles && roles.filter((x) => x === "Developer").length > 0) {
        myUser.isDeveloper = true;
      } else {
        myUser.isDeveloper = false;
      }

      if (roles && roles.filter((x) => x === "User").length > 0) {
        myUser.isUser = true;
      } else {
        myUser.isUser = false;
      }
      setCurrentUser(myUser);
    }
  }, [user]);

  // Toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [toastOptions, setToastOptions] = useState({});

  const doToast = (severity, message, options) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
    setToastOptions(options);
  };

  const toastValues = {
    toastOpen,
    toastMessage,
    toastSeverity,
    toastOptions,
    setToastOpen,
    setToastMessage,
    setToastSeverity,
    setToastOptions,
    doToast,
  };

  // Confirm Dialog
  const [confirmDialogKey, setConfirmDialogKey] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogPayload, setConfirmDialogPayload] = useState(null);
  const [confirmDialogCallback, setConfirmDialogCallback] = useState(
    async () => {}
  );

  const confirmationDialogValues = {
    confirmDialogKey,
    setConfirmDialogKey,
    confirmDialogOpen,
    setConfirmDialogOpen,
    confirmDialogPayload,
    setConfirmDialogPayload,
    confirmDialogCallback,
    setConfirmDialogCallback,
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        ...toastValues,
        ...confirmationDialogValues,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
