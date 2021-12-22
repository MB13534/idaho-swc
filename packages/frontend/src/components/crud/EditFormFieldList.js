import React from "react";
import { CRUD_FIELD_TYPES } from "../../constants";
import EditFormTextField from "./fields/EditFormTextField";
import EditFormDropdown from "./fields/EditFormDropdown";
import EditFormNumber from "./fields/EditFormNumber";
import EditFormDateTime from "./fields/EditFormDateTime";
import { v4 as uuidv4 } from "uuid";
import EditFormSectionHeader from "./fields/EditFormSectionHeader";
import EditFormDivider from "./fields/EditFormDivider";
import EditFormSplitStringDropdown from "./fields/EditFormSplitStringDropdown";
import EditFormReadOnlyArrayOfLinks from "./fields/EditFormReadOnlyArrayOfLinks";

export function EditFormFieldList({
  data,
  fields,
  setFields,
  setFieldValue,
  values,
  valueCache,
  currentVersion,
  touched,
  errors,
  handleBlur,
  handleChange,
}) {
  return fields.map((field, index) => {
    const defaultVariant = "outlined";
    const type = field.type || CRUD_FIELD_TYPES.TEXT;
    const hasError = Boolean(touched[field.key] && errors[field.key]);
    const isFieldDirty = Boolean(values[field.key] !== data[field.key]);

    const toggleField = (fieldKey) => {
      setFields((prevState) => {
        let newValues = [...prevState];

        newValues.find((x) => x.key === fieldKey).isOpen = !newValues.find(
          (x) => x.key === fieldKey
        ).isOpen;

        return newValues;
      });
    };

    let FieldComponent = null;

    if (
      type === CRUD_FIELD_TYPES.TEXT ||
      type === CRUD_FIELD_TYPES.EMAIL ||
      type === CRUD_FIELD_TYPES.MULTILINE_TEXT
    ) {
      FieldComponent = EditFormTextField;
    }

    if (type === CRUD_FIELD_TYPES.DROPDOWN) {
      FieldComponent = EditFormDropdown;
    }

    if (type === CRUD_FIELD_TYPES.NUMBER) {
      FieldComponent = EditFormNumber;
    }

    if (
      type === CRUD_FIELD_TYPES.DATE ||
      type === CRUD_FIELD_TYPES.TIME ||
      type === CRUD_FIELD_TYPES.DATETIME
    ) {
      FieldComponent = EditFormDateTime;
    }

    if (type === CRUD_FIELD_TYPES.SPLIT_STRING_DROPDOWN) {
      FieldComponent = EditFormSplitStringDropdown;
    }

    if (type === CRUD_FIELD_TYPES.READ_ONLY_ARRAY_OF_LINKS) {
      FieldComponent = EditFormReadOnlyArrayOfLinks;
    }

    if (type === CRUD_FIELD_TYPES.DIVIDER) {
      FieldComponent = EditFormDivider;
    }

    if (type === CRUD_FIELD_TYPES.SECTION_HEADER) {
      FieldComponent = EditFormSectionHeader;
    }

    if (type === CRUD_FIELD_TYPES.CUSTOM) {
      FieldComponent = field.component;
    }

    if (!field.key) field.key = uuidv4();

    if (!FieldComponent) {
      return "Unknown Field Type";
    }

    return (
      <FieldComponent
        key={field.key}
        type={type}
        index={index}
        data={data}
        field={field}
        setFieldValue={setFieldValue}
        currentVersion={currentVersion}
        hasError={hasError}
        toggleField={toggleField}
        isFieldDirty={isFieldDirty}
        values={values}
        valueCache={valueCache}
        touched={touched}
        errors={errors}
        handleBlur={handleBlur}
        handleChange={handleChange}
        variant={defaultVariant}
      />
    );
  });
}
