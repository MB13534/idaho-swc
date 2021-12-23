import React, { useEffect } from "react";
import {
  withWidth,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
} from "@material-ui/core";

import { Droplet } from "react-feather";
import { EditFormFieldWrap } from "../EditFormFieldWrap";

function EditFormReadOnlyArrayOfLinks({
  data,
  field,
  setFieldValue,
  currentVersion,
  hasError,
  toggleField,
  isFieldDirty,
}) {
  useEffect(() => {
    if (
      field.defaultValue !== null &&
      typeof field.defaultValue !== "undefined"
    ) {
      setFieldValue(field.key, field.defaultValue);
    }
  }, [field.defaultValue, setFieldValue, field.key]);

  if (!data[field.key]) return null;

  return (
    <EditFormFieldWrap
      data={data}
      field={field}
      currentVersion={currentVersion}
      hasError={hasError}
      toggleField={toggleField}
      isFieldDirty={isFieldDirty}
      setFieldValue={setFieldValue}
    >
      {
        <List>
          {data[field.key].map((item) => {
            return (
              <ListItem key={item}>
                <ListItemIcon>
                  <Droplet />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            );
          })}
        </List>
      }
    </EditFormFieldWrap>
  );
}

export default withWidth()(EditFormReadOnlyArrayOfLinks);
