import axios from "axios";
import { pluralize } from "inflected";
import { CONFIG, CONTENT_NODE_STATUS_IDS } from "../constants";
import { v4 as uuidv4 } from "uuid";
import * as inflector from "inflected";

const applyLatestVersionToRecord = (record) => {
  if (record.versions.length === 0) return record;

  let newRecord = { ...record };

  if (
    record.status_id === CONTENT_NODE_STATUS_IDS.UPDATED ||
    record.status_id === CONTENT_NODE_STATUS_IDS.DRAFT
  ) {
    newRecord = { ...record.versions[0] };
    newRecord.version_id = newRecord.id;
    newRecord.id = record.id;
    newRecord.parent_id = null;
    newRecord.former_parent_id = record.former_parent_id;
    newRecord.parent = null;
    newRecord.status_id = record.status_id;
    newRecord.content_node_statuses = record.content_node_statuses;
    newRecord.versions = record.versions;
    newRecord.created_at = record.created_at;
    newRecord.created_by = record.created_by;
    newRecord.updated_at = record.updated_at;
    newRecord.updated_by = record.updated_by;
    newRecord.parentRecord = record;
  }

  newRecord.total_versions = record.versions.length + 1;

  const parentVersion = { ...record };

  ["content_node_statuses", "parent", "versions"].forEach((x) => {
    delete parentVersion[x];
  });

  newRecord.versions.push(parentVersion);

  // sort by created_at DESC
  newRecord.versions.sort(function (a, b) {
    const ka = new Date(a.created_at),
      kb = new Date(b.created_at);
    if (ka < kb) return 1;
    if (ka > kb) return -1;
    return 0;
  });

  // set is_latest and is_published flags
  newRecord.versions = newRecord.versions.map((version, index) => {
    if (index === 0) version.is_latest = true;
    if (
      version.id === record.id &&
      record.status_id !== CONTENT_NODE_STATUS_IDS.DRAFT
    )
      version.is_published = true;
    return version;
  });

  // max of 5 versions
  newRecord.versions = newRecord.versions.slice(0, CONFIG.VERSION_LIMIT);

  if (record.status_id !== CONTENT_NODE_STATUS_IDS.DRAFT) {
    // make sure published record is always in list
    if (newRecord.versions.filter((x) => x.is_published).length === 0) {
      newRecord.versions.push(parentVersion);
    }
  }

  return newRecord;
};

const getUrl = (modelName) => {
  const endpoint = inflector.dasherize(
    inflector.underscore(inflector.pluralize(modelName))
  );

  return `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}`;
};

const getConfig = (token) => {
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export function findRecords(modelName, token) {
  return new Promise(async (resolve, reject) => {
    try {
      const records = await findRawRecords(modelName, token);

      resolve(records.map((x) => applyLatestVersionToRecord(x)) ?? []);
    } catch (error) {
      reject(error);
    }
  });
}

export function findRawRecords(modelName, token) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(getUrl(modelName), getConfig(token));

      if (response.status === 200) {
        resolve(response.data);
      }

      reject(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

export function fetchRecord(modelName, id, token) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) return;

      const record = await fetchRawRecord(modelName, id, token);

      if (!record) {
        reject({ message: "Record not found." });
        return;
      }

      const futureRecord = await fetchRecordFuture(modelName, id, token);

      const versionizedRecord = applyLatestVersionToRecord(record);

      versionizedRecord.future_parent_id = futureRecord?.id
        ? futureRecord.id
        : null;

      resolve(versionizedRecord);
    } catch (error) {
      reject(error);
    }
  });
}

export function fetchRawRecord(modelName, id, token) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${getUrl(modelName)}/${id}`,
        getConfig(token)
      );

      if (response.status === 200) {
        resolve(response.data);
      }

      reject(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

export function fetchRecordFuture(modelName, id, token) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${getUrl(modelName)}/${id}/future`,
        getConfig(token)
      );

      if (response.status === 200) {
        resolve(response.data);
      }

      reject(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

export function createRecord(modelName, record, publish = false, token) {
  return new Promise(async (resolve, reject) => {
    try {
      if (publish) record.status_id = CONTENT_NODE_STATUS_IDS.PUBLISHED;
      else record.status_id = CONTENT_NODE_STATUS_IDS.DRAFT;

      const response = await axios.post(
        getUrl(modelName),
        record,
        getConfig(token)
      );

      if (response.status === 200) {
        resolve(response.data);
      }

      reject(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

export function updateRecord(modelName, record, publish = false, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let newRecord = {};

      if (publish) {
        newRecord = await createRecord(
          modelName,
          {
            ...record,
            status_id: CONTENT_NODE_STATUS_IDS.PUBLISHED,
            parent_id: null,
          },
          publish,
          token
        );
      } else {
        newRecord = await createRecord(
          modelName,
          { ...record, parent_id: record.id },
          publish,
          token
        );
      }

      if (publish) {
        const newDraftId = uuidv4();

        await axios.put(
          `${getUrl(modelName)}/${record.id}/silent`,
          {
            id: newDraftId,
            parent_id: record.id,
            status_id: CONTENT_NODE_STATUS_IDS.DRAFT,
          },
          getConfig(token)
        );

        await axios.put(
          `${getUrl(modelName)}/${newRecord.id}/silent`,
          { id: record.id, former_parent_id: newDraftId },
          getConfig(token)
        );

        const recordAfter = await fetchRecord(modelName, record.id, token);

        resolve(recordAfter);
      } else {
        const response = await axios.put(
          `${getUrl(modelName)}/${record.id}/silent`,
          {
            status_id:
              record.status_id === CONTENT_NODE_STATUS_IDS.DRAFT
                ? CONTENT_NODE_STATUS_IDS.DRAFT
                : CONTENT_NODE_STATUS_IDS.UPDATED,
          },
          getConfig(token)
        );

        if (response.status === 200) {
          resolve(response.data);
        }

        reject(response.data);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function undoRecord(modelName, id, token) {
  return new Promise(async (resolve, reject) => {
    try {
      // User Scenario
      // -------------
      // ID, Status, LName, CDate, UDate, Parent, FParent
      // User publishes Siebert
      // A  2 Siebert 12  12  null  null
      // User publishes Kulak
      // A  2 Kulak   1   1   null  B
      // B  1 Siebert 12  12  A     null
      // User publishes Smith
      // A  2 Smith   2   2   null  C
      // C  1 Kulak   1   1   A     B
      // B  1 Siebert 12  12  A     null
      // User undoes changes
      // D  1 Smith   2   2   A     A
      // A  2 Kulak   1   1   null  B
      // B  1 Siebert 12  12  A     null
      // User redoes changes
      // A  2 Smith   2   2   null  E
      // E  1 Kulak   1   1   A     B
      // B  1 Siebert 12  12  A     null
      // --
      // undo
      // copy status from record to record's former_parent_id
      // set records status_id to DRAFT
      // generate new uuid, set record.id to that
      // set former_parent_id.id to new uuid
      // null out former_parent_id.parent_id
      // set record.former_parent_id to record.id
      // set record.parent_id to record.id
      // --
      // redo
      // generate new uuid
      // find future record where any record's former_parent_id is equal to record.id
      // set future.status_id to record.status_id
      // set future.parent_id to null
      // set future.id = record.id
      // set future.former_parent_id = new uuid
      // set record.id to new uuid
      // set record.status_id to DRAFT
      // set record.parent_id to record.id

      const existingRecord = await fetchRecord(modelName, id, token);

      if (!existingRecord.former_parent_id) {
        reject({ type: "warning", message: "Skipped: Nothing to undo." });
        return;
      }

      const newDraftId = uuidv4();

      await axios.put(
        `${getUrl(modelName)}/${id}/silent`,
        {
          id: newDraftId,
          status_id: CONTENT_NODE_STATUS_IDS.DRAFT,
          former_parent_id: id,
          parent_id: id,
        },
        getConfig(token)
      );

      await axios.put(
        `${getUrl(modelName)}/${existingRecord.former_parent_id}/silent`,
        {
          id: id,
          status_id: existingRecord.status_id,
          parent_id: null,
        },
        getConfig(token)
      );

      const recordAfter = await fetchRecord(modelName, id, token);

      resolve(recordAfter);
    } catch (error) {
      reject(error);
    }
  });
}

export function redoRecord(modelName, id, token) {
  return new Promise(async (resolve, reject) => {
    try {
      // User Scenario
      // -------------
      // ID, Status, LName, CDate, UDate, Parent, FParent
      // User publishes Siebert
      // A  2 Siebert 12  12  null  null
      // User publishes Kulak
      // A  2 Kulak   1   1   null  B
      // B  1 Siebert 12  12  A     null
      // User publishes Smith
      // A  2 Smith   2   2   null  C
      // C  1 Kulak   1   1   A     B
      // B  1 Siebert 12  12  A     null
      // User undoes changes
      // D  1 Smith   2   2   A     A
      // A  2 Kulak   1   1   null  B
      // B  1 Siebert 12  12  A     null
      // User redoes changes
      // A  2 Smith   2   2   null  E
      // E  1 Kulak   1   1   A     B
      // B  1 Siebert 12  12  A     null
      // --
      // undo
      // copy status from record to record's former_parent_id
      // set records status_id to DRAFT
      // generate new uuid, set record.id to that
      // set former_parent_id.id to new uuid
      // null out former_parent_id.parent_id
      // set record.former_parent_id to record.id
      // set record.parent_id to record.id
      // --
      // redo
      // generate new uuid
      // find future record where any record's former_parent_id is equal to record.id
      // set future.status_id to record.status_id
      // set future.parent_id to null
      // set future.id = record.id
      // set future.former_parent_id = new uuid
      // set record.id to new uuid
      // set record.status_id to DRAFT
      // set record.parent_id to record.id

      const existingRecord = await fetchRecord(modelName, id, token);
      const futureRecord = await fetchRecordFuture(modelName, id, token);

      if (!futureRecord) {
        reject({ type: "warning", message: "Skipped: Nothing to redo." });
        return;
      }

      const newDraftId = uuidv4();

      await axios.put(
        `${getUrl(modelName)}/${id}/silent`,
        {
          id: newDraftId,
          parent_id: id,
          status_id: CONTENT_NODE_STATUS_IDS.DRAFT,
        },
        getConfig(token)
      );

      await axios.put(
        `${getUrl(modelName)}/${futureRecord.id}/silent`,
        {
          id: id,
          parent_id: null,
          former_parent_id: newDraftId,
          status_id: existingRecord.status_id,
        },
        getConfig(token)
      );

      const recordAfter = await fetchRecord(modelName, id, token);

      resolve(recordAfter);
    } catch (error) {
      reject(error);
    }
  });
}

/*export function updateRecordWithVersioning(
  modelName,
  record,
  publish = false,
  token
) {
  return new Promise(async (resolve, reject) => {
    try {
      let submittedRecord = { ...record };

      const existingRecord = await fetchRawRecord(modelName, record, token);
      const existingIsPublished =
        existingRecord.status_id === CONTENT_NODE_STATUS_IDS.PUBLISHED;
      const existingIsDraft =
        existingRecord.status_id === CONTENT_NODE_STATUS_IDS.DRAFT;
      const existingIsUpdated =
        existingRecord.status_id === CONTENT_NODE_STATUS_IDS.UPDATED;

      // make copy of existing record and save as a draft

      const versionRecord = await createVersionRecord(
        modelName,
        {
          ...existingRecord,
          id: "",
          created_at: existingRecord.created_at,
          created_by: existingRecord.created_by,
          updated_at: existingRecord.updated_at,
          updated_by: existingRecord.updated_by,
          parent_id: existingRecord.id,
          status_id: CONTENT_NODE_STATUS_IDS.DRAFT,
        },
        token
      );

      // // patch created and updated dates silently
      // await updateRecord(
      //   modelName,
      //   {
      //     id: versionRecord.id,
      //     created_at: existingRecord.created_at,
      //     created_by: existingRecord.created_by,
      //     updated_at: existingRecord.updated_at,
      //     updated_by: existingRecord.updated_by,
      //   },
      //   token,
      //   true
      // );

      //if record submitted matches published record, remark as published
      delete existingRecord.versions;
      delete existingRecord.content_node_statuses;
      delete submittedRecord.versions;
      delete submittedRecord.content_node_statuses;
      const savedMatchesPublished = isEqual(existingRecord, submittedRecord);

      console.log("did records match?", savedMatchesPublished);
      console.log("existing", existingRecord, "submitted", submittedRecord);

      if (!publish && savedMatchesPublished && !existingIsDraft) {
        submittedRecord = await updateRecord(
          modelName,
          {
            id: existingRecord.id,
            status_id: CONTENT_NODE_STATUS_IDS.PUBLISHED,
          },
          token
        );
      } else {
        // updated existing published record with submitted changes
        submittedRecord = await updateRecord(
          modelName,
          {
            ...submittedRecord,
            status_id: publish
              ? CONTENT_NODE_STATUS_IDS.PUBLISHED
              : existingIsDraft
              ? CONTENT_NODE_STATUS_IDS.DRAFT
              : CONTENT_NODE_STATUS_IDS.UPDATED,
          },
          token
        );
      }

      // return the versioned record
      resolve(submittedRecord);
    } catch (error) {
      reject(error);
    }
  });
}*/

export function deleteRecord(modelName, record, token) {
  return new Promise((resolve, reject) => {
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .delete(`${getUrl(modelName)}/${record.id}`, { headers })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function publishRecord(modelName, record, token) {
  return new Promise((resolve, reject) => {
    const endpoint = pluralize(modelName).toLowerCase();
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${record.id}/publish`,
        { headers }
      )
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function unpublishRecord(modelName, record, token) {
  return new Promise((resolve, reject) => {
    const endpoint = pluralize(modelName).toLowerCase();
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${record.id}/unpublish`,
        { headers }
      )
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function enableRecord(modelName, record, token) {
  return new Promise((resolve, reject) => {
    const endpoint = pluralize(modelName).toLowerCase();
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${record.id}/enable`,
        { headers }
      )
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function disableRecord(modelName, record, token) {
  return new Promise((resolve, reject) => {
    const endpoint = pluralize(modelName).toLowerCase();
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(
        `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${record.id}/disable`,
        { headers }
      )
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
