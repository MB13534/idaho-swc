import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loader from "./Loader";

// For routes that can only be accessed by authenticated users
const AuthGuard = ({ type = "route", children }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    loginWithRedirect();
    return <></>;
  }

  return children;
};

export default withAuthenticationRequired(AuthGuard, {
  onRedirecting: () => <Loader />,
});
