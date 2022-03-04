import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

// For routes that can only be accessed by admin users
const UserVisibilityFilter = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  if (!user) return <React.Fragment />;

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
    return <React.Fragment />;
  }

  return children;
};

export default UserVisibilityFilter;
