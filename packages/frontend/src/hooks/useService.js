import React from "react";
import { useApp } from "../AppProvider";
import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@material-ui/core";

/**
 * Hook for calling a service
 *
 * @returns {function([serviceMethod, [*]], *=, *=): Promise<*|undefined>}
 * @example
 * import { serviceMethod } from "./path/to/service.js"
 * const service = useService();
 * const data = await service(
 *     [serviceMethod, [param1, param2]],
 *     "Success Message",
 *     "Failure Message",
 *   );
 */
const useService = ({ toast = true } = {}) => {
  const { doToast, currentUser } = useApp();
  const { getAccessTokenSilently } = useAuth0();

  return async (
    callback,
    successMessage = "Operation completed successfully.",
    failureMessage = "Something went wrong."
  ) => {
    try {
      const token = await getAccessTokenSilently();
      const result = await callback[0].apply(
        this,
        [...callback[1], token] || []
      );
      toast && doToast("success", successMessage);
      return result;
    } catch (error) {
      let message = error?.message ?? failureMessage;
      const type = error?.type ?? "error";
      const data = error.response.data;
      if (currentUser.isAdmin && data.length > 0) {
        message = (
          <React.Fragment>
            <Box mb={2}>{message}</Box>
            <div dangerouslySetInnerHTML={{ __html: data }} />
          </React.Fragment>
        );
        console.error(
          data
            .replace(/(<br>)/gi, `\n`)
            .replace(/(&nbsp;)/gi, " ")
            .replace(/(&quot;)/gi, '"')
            .replace(/(<([^>]+)>)/gi, "")
        );
      }
      console.error(error);
      toast && doToast(type, message, { persist: true });
      return false;
    }
  };
};

export default useService;
