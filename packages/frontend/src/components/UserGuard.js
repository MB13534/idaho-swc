import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loader from "./Loader";
import Unauthorized from "./Unauthorized";

// For routes that can only be accessed by admin users
const AdminGuard = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  const roles = user[`${process.env.REACT_APP_AUDIENCE}/roles`];
  let isAdmin = false;
  if (roles && roles.filter((x) => x === "User").length > 0) {
    isAdmin = true;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Unauthorized />;
  }

  return children;
};

export default withAuthenticationRequired(AdminGuard, {
  onRedirecting: () => <Loader />,
});
