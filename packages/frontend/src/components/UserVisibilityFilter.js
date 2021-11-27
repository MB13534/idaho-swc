import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loader from "./Loader";

// For routes that can only be accessed by admin users
const AdminVisibilityFilter = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  const roles = user[`${process.env.REACT_APP_AUDIENCE}/roles`];
  let isAdmin = false;
  if (roles && roles.filter((x) => x === "User").length > 0) {
    isAdmin = true;
  }

  if (!isAuthenticated || !isAdmin) {
    return <React.Fragment />;
  }

  return children;
};

export default withAuthenticationRequired(AdminVisibilityFilter, {
  onRedirecting: () => <Loader />,
});
