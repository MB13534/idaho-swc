import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Unauthorized from "./Unauthorized";

// For routes that can only be accessed by admin users
const UserGuard = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  if (!user) return <Unauthorized />;

  const roles = user[`${process.env.REACT_APP_AUDIENCE}/roles`];
  let isUser = false;
  if (
    roles &&
    roles.filter((x) => ["User", "Administrator", "Developer"].includes(x))
      .length > 0
  ) {
    isUser = true;
  }

  if (!isAuthenticated || !isUser) {
    return <Unauthorized />;
  }

  return children;
};

export default UserGuard;
