import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Unauthorized from "./Unauthorized";

// For routes that can only be accessed by admin users
const DeveloperGuard = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  if (!user) return <Unauthorized />;

  const roles = user[`${process.env.REACT_APP_AUDIENCE}/roles`];
  let isDeveloper = false;
  if (roles && roles.filter((x) => x === "Developer").length > 0) {
    isDeveloper = true;
  }

  if (!isAuthenticated || !isDeveloper) {
    return <Unauthorized />;
  }

  return children;
};

export default DeveloperGuard;
