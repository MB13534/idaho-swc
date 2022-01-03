import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

// For routes that can only be accessed by admin users
const DeveloperVisibilityFilter = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  if (!user) return <React.Fragment />;

  const roles = user[`${process.env.REACT_APP_AUDIENCE}/roles`];
  let isDeveloper = false;
  if (roles && roles.filter((x) => x === "Developer").length > 0) {
    isDeveloper = true;
  }

  if (!isAuthenticated || !isDeveloper) {
    return <React.Fragment />;
  }

  return children;
};

export default DeveloperVisibilityFilter;
