import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loader from "./Loader";

// For routes that can only be accessed by admin users
const UserVisibilityFilter = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  const roles = user[`${process.env.REACT_APP_AUDIENCE}/roles`];
  let isUser = false;
  if (roles && roles.filter((x) => x === "Well Owner").length > 0) {
    isUser = true;
  }

  if (!isAuthenticated || !isUser) {
    return <React.Fragment />;
  }

  return children;
};

export default withAuthenticationRequired(UserVisibilityFilter, {
  onRedirecting: () => <Loader />,
});
