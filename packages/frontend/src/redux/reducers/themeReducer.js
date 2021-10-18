import * as types from "../../constants";

const initialState = {
  currentTheme: localStorage.getItem("theme") || types.THEMES.LIGHT,
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case types.THEME_SELECTED:
      return {
        ...state,
        currentTheme: actions.payload,
      };

    default:
      return state;
  }
}
