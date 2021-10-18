import { CRUD_FIELD_TYPES } from "../constants";
import * as Yup from "yup";

export function generateSchemaShape(fields) {
  const schemaShape = {};

  fields.forEach((field) => {
    let schema = field.validationSchema || null;

    if (
      [
        CRUD_FIELD_TYPES.TEXT,
        CRUD_FIELD_TYPES.MULTILINE_TEXT,
        CRUD_FIELD_TYPES.EMAIL,
      ].includes(field.type)
    ) {
      schema = Yup.string();
    }

    if (field.type === CRUD_FIELD_TYPES.DROPDOWN) {
      schema = Yup.mixed();
    }

    if (field.type === CRUD_FIELD_TYPES.NUMBER) {
      schema = Yup.number();
      const config = field.typeConfig || {};
      if (typeof config.min !== "undefined") {
        schema = schema.min(
          config.min,
          "Must be greater than or equal to ${min}." //eslint-disable-line
        );
      }
      if (typeof config.max !== "undefined") {
        schema = schema.max(
          config.max,
          "Must be less than or equal to ${max}." //eslint-disable-line
        );
      }
      if (typeof config.lessThan !== "undefined") {
        schema = schema.lessThan(
          config.lessThan,
          "Must be less than ${less}." //eslint-disable-line
        );
      }
      if (typeof config.moreThan !== "undefined") {
        schema = schema.moreThan(
          config.moreThan,
          "Must be more than ${more}." //eslint-disable-line
        );
      }
    }

    if (
      field.type === CRUD_FIELD_TYPES.DATE ||
      field.type === CRUD_FIELD_TYPES.TIME ||
      field.type === CRUD_FIELD_TYPES.DATETIME
    ) {
      schema = Yup.mixed();
    }

    if (field.type === CRUD_FIELD_TYPES.EMAIL) {
      schema = schema.email("Email must be a valid email address.");
    }

    if (!schema) {
      schema = Yup.mixed();
    }

    if (field.required) {
      schema = schema.required("This field is required.");
    } else {
      schema = schema.nullable();
    }

    schemaShape[field.key] = schema;
  });

  return schemaShape;
}
