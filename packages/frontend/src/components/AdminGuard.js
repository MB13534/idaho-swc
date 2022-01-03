import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Unauthorized from "./Unauthorized";

// For routes that can only be accessed by admin users
const AdminGuard = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  if (!user) return <Unauthorized />;

  const roles = user[`${process.env.REACT_APP_AUDIENCE}/roles`];
  let isAdmin = false;
  if (roles && roles.filter((x) => x === "Administrator").length > 0) {
    isAdmin = true;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Unauthorized />;
  }

  return children;
};

export default AdminGuard;
