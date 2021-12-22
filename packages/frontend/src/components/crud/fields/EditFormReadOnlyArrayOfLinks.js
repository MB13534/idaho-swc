import React, { useEffect } from "react";
import {
  withWidth,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
} from "@material-ui/core";
import parse from "html-react-parser";
import FolderIcon from "@material-ui/icons/Folder";
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
          {data[field.key].split(",").map((item) => {
            return (
              <ListItem
                button
                component="a"
                href={parse(item).props.href}
                target="_blank"
                key={item}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary={parse(item).props.children} />
              </ListItem>
            );
          })}
        </List>
      }
    </EditFormFieldWrap>
  );
}

export default withWidth()(EditFormReadOnlyArrayOfLinks);
