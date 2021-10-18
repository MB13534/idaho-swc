import * as types from "../../constants";
import {
  signUp as authSignUp,
  resetPassword as authResetPassword,
} from "../../services/authService";

export function signIn(user) {
  return async (dispatch) => {
    dispatch({
      type: types.AUTH_SIGN_IN_SUCCESS,
      user: user,
    });
  };
}

export function refreshMetadata(user) {
  return async (dispatch) => {
    dispatch({
      type: types.AUTH_METADATA_REFRESH,
      user: user,
    });
  };
}

export function signUp(credentials) {
  return async (dispatch) => {
    dispatch({ type: types.AUTH_SIGN_UP_REQUEST });

    return authSignUp(credentials)
      .then((response) => {
        dispatch({
          type: types.AUTH_SIGN_UP_SUCCESS,
          id: response.id,
          email: response.email,
          name: response.name,
        });
      })
      .catch((error) => {
        dispatch({ type: types.AUTH_SIGN_UP_FAILURE });
        throw error;
      });
  };
}

export function signOut() {
  return async (dispatch) => {
    dispatch({
      type: types.AUTH_SIGN_OUT,
    });
  };
}

export function resetPassword(credentials) {
  return async (dispatch) => {
    dispatch({ type: types.AUTH_RESET_PASSWORD_REQUEST });

    return authResetPassword(credentials)
      .then((response) => {
        dispatch({
          type: types.AUTH_RESET_PASSWORD_SUCCESS,
          email: response.email,
        });
      })
      .catch((error) => {
        dispatch({ type: types.AUTH_RESET_PASSWORD_FAILURE });
        throw error;
      });
  };
}
