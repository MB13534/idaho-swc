import { ACTIONS } from "../../constants";
import {
  createRecord as crudCreateRecord,
  deleteRecord as crudDeleteRecord,
  disableRecord as crudDisableRecord,
  enableRecord as crudEnableRecord,
  fetchRecord as crudFetchRecord,
  findRecords as crudFindRecords,
  publishRecord as crudPublishRecord,
  unpublishRecord as crudUnpublishRecord,
  updateRecord as crudUpdateRecord,
} from "../../services/crudService";

export function findRecords(modelName, options, token) {
  return async (dispatch) => {
    dispatch({ type: ACTIONS.CRUD_MODEL_FIND_REQUEST, options });

    return crudFindRecords(modelName, options, token)
      .then((records) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_FIND_SUCCESS,
          options,
          records,
        });
      })
      .catch((error) => {
        dispatch({ type: ACTIONS.CRUD_MODEL_FIND_FAILURE, options });
        throw error;
      });
  };
}

export function fetchRecord(modelName, record, token) {
  return async (dispatch) => {
    dispatch({ type: ACTIONS.CRUD_MODEL_FETCH_REQUEST, record });

    return crudFetchRecord(modelName, record, token)
      .then((response) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_FETCH_SUCCESS,
          record: response,
        });
      })
      .catch((error) => {
        dispatch({ type: ACTIONS.CRUD_MODEL_FETCH_FAILURE, record });
        throw error;
      });
  };
}

export function createRecord(modelName, record, token) {
  return (dispatch) => {
    dispatch({ type: ACTIONS.CRUD_MODEL_CREATE_REQUEST, record });

    return crudCreateRecord(modelName, record, token)
      .then((response) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_CREATE_SUCCESS,
          record: response,
        });
      })
      .catch((error) => {
        dispatch({ type: ACTIONS.CRUD_MODEL_CREATE_FAILURE, record });
        throw error;
      });
  };
}

export function createAndPublishRecord(modelName, record, token) {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.CRUD_MODEL_CREATE_REQUEST,
      record: record,
    });

    return crudCreateRecord(modelName, record, token)
      .then((response) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_CREATE_SUCCESS,
          record: response,
        });

        dispatch({
          type: ACTIONS.CRUD_MODEL_PUBLISH_REQUEST,
          record: response,
        });
        return crudPublishRecord(modelName, response, token)
          .then((response) => {
            dispatch({
              type: ACTIONS.CRUD_MODEL_PUBLISH_SUCCESS,
              record: response,
            });
          })
          .catch((error) => {
            dispatch({
              type: ACTIONS.CRUD_MODEL_PUBLISH_FAILURE,
              record: response,
            });
            throw error;
          });
      })
      .catch((error) => {
        dispatch({ type: ACTIONS.CRUD_MODEL_CREATE_FAILURE, record });
        throw error;
      });
  };
}

export function updateRecord(modelName, record, token) {
  return async (dispatch) => {
    dispatch({ type: ACTIONS.CRUD_MODEL_UPDATE_REQUEST, record });

    return crudUpdateRecord(modelName, record, token)
      .then((response) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_UPDATE_SUCCESS,
          record: response,
        });
      })
      .catch((error) => {
        dispatch({ type: ACTIONS.CRUD_MODEL_UPDATE_FAILURE, record });
        throw error;
      });
  };
}

export function deleteRecord(modelName, record, token) {
  return async (dispatch) => {
    dispatch({ type: ACTIONS.CRUD_MODEL_DELETE_REQUEST, record });

    return crudDeleteRecord(modelName, record, token)
      .then(() => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_DELETE_SUCCESS,
          record,
        });
      })
      .catch((error) => {
        dispatch({ type: ACTIONS.CRUD_MODEL_DELETE_FAILURE, record });
        throw error;
      });
  };
}

export function publishRecord(modelName, record, token) {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.CRUD_MODEL_PUBLISH_REQUEST,
      record,
    });

    return crudPublishRecord(modelName, record, token)
      .then((response) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_PUBLISH_SUCCESS,
          record: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_PUBLISH_FAILURE,
          record,
        });
        throw error;
      });
  };
}

export function unpublishRecord(modelName, record, token) {
  return async (dispatch) => {
    dispatch({ type: ACTIONS.CRUD_MODEL_UNPUBLISH_REQUEST, record });

    return crudUnpublishRecord(modelName, record, token)
      .then((response) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_UNPUBLISH_SUCCESS,
          record: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_UNPUBLISH_FAILURE,
          record,
        });
        throw error;
      });
  };
}

export function enableRecord(modelName, record, token) {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.CRUD_MODEL_ENABLE_REQUEST,
      record,
    });

    return crudEnableRecord(modelName, record, token)
      .then((response) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_ENABLE_SUCCESS,
          record: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_ENABLE_FAILURE,
          record,
        });
        throw error;
      });
  };
}

export function disableRecord(modelName, record, token) {
  return async (dispatch) => {
    dispatch({ type: ACTIONS.CRUD_MODEL_DISABLE_REQUEST, record });

    return crudDisableRecord(modelName, record, token)
      .then((response) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_DISABLE_SUCCESS,
          record: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.CRUD_MODEL_DISABLE_FAILURE,
          record,
        });
        throw error;
      });
  };
}
