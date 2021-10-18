import * as types from "../../constants";

export function themeSelected(value) {
  localStorage.setItem("theme", value);
  return {
    type: types.THEME_SELECTED,
    payload: value,
  };
}
