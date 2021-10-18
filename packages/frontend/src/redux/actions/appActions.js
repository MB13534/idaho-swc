import { ACTIONS } from "../../constants";

export function crudModelUpdate(value) {
  return {
    type: ACTIONS.APP_CRUD_MODEL_UPDATE,
    payload: value,
  };
}
