import { ACTIONS } from "../../constants";

export default function reducer(state = {}, actions) {
  switch (actions.type) {
    case ACTIONS.CRUD_MODEL_FIND_SUCCESS:
      return {
        ...state,
        records: actions.records,
      };

    case ACTIONS.CRUD_MODEL_FETCH_SUCCESS:
      return {
        ...state,
        record: actions.record,
      };

    case ACTIONS.CRUD_MODEL_CREATE_SUCCESS:
      return {
        ...state,
        record: actions.record,
      };

    case ACTIONS.CRUD_MODEL_CREATE_AND_PUBLISH_SUCCESS:
      return {
        ...state,
        record: actions.record,
      };

    case ACTIONS.CRUD_MODEL_UPDATE_SUCCESS:
      return {
        ...state,
        record: actions.record,
      };

    case ACTIONS.CRUD_MODEL_UPDATE_AND_PUBLISH_SUCCESS:
      return {
        ...state,
        record: actions.record,
      };

    case ACTIONS.CRUD_MODEL_DELETE_SUCCESS:
      return {
        ...state,
        record: actions.record,
      };

    case ACTIONS.CRUD_MODEL_PUBLISH_SUCCESS:
      return {
        ...state,
        record: actions.record,
      };

    case ACTIONS.CRUD_MODEL_UNPUBLISH_SUCCESS:
      return {
        ...state,
        record: actions.record,
      };

    case ACTIONS.CRUD_MODEL_ENABLE_SUCCESS:
      return {
        ...state,
        record: actions.record,
      };

    case ACTIONS.CRUD_MODEL_DISABLE_SUCCESS:
      return {
        ...state,
        record: actions.record,
      };

    default:
      return state;
  }
}
