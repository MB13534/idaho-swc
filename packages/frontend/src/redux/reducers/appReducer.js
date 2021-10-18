import { ACTIONS } from "../../constants";

const initialState = {
  currentCrudModel: null,
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case ACTIONS.APP_CRUD_MODEL_UPDATE:
      return {
        ...state,
        currentCrudModel: actions.payload,
      };

    default:
      return state;
  }
}
