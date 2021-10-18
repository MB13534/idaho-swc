import { useDispatch } from "react-redux";
import { useApp } from "../AppProvider";
import { useAuth0 } from "@auth0/auth0-react";

const useRedux = () => {
  const dispatch = useDispatch();
  const { doToast } = useApp();
  const { getAccessTokenSilently } = useAuth0();

  return async (
    callback,
    successMessage = "Operation completed successfully.",
    failureMessage = "Something went wrong."
  ) => {
    try {
      const token = await getAccessTokenSilently();
      const result = await dispatch(callback(token));
      doToast("success", successMessage);
      return result;
    } catch (error) {
      const message = error?.message ?? failureMessage;
      doToast("error", message);
    }
  };
};

export default useRedux;
