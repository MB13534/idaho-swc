import * as types from "../../constants";

export default function reducer(state = {}, actions) {
  switch (actions.type) {
    case types.AUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        user: actions.user,
      };

    case types.AUTH_SIGN_OUT:
      return {
        ...state,
        user: undefined,
      };

    case types.AUTH_METADATA_REFRESH:
      return {
        ...state,
        user: actions.user,
      };

    default:
      return state;
  }
}
