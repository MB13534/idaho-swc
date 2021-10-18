import React from "react";
import styled from "styled-components/macro";

import { Helmet } from "react-helmet-async";

import {
  Box,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Typography as MuiTypography,
  useTheme,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Code from "../../components/Code";
import { THEME } from "../../constants";

const Typography = styled(MuiTypography)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);

const commands = [
  {
    name: "add:model",
    desc: "Generate a new CRUD interface for a model.",
  },
  {
    name: "add:page",
    desc: "Generate a new page from a template.",
  },
  {
    name: "add:field",
    desc: "Adds a new field to an existing CRUD interface. (Coming Soon)",
  },
];

const sharedOptions = [
  {
    name: "required",
    type: "bool",
    default: "false",
    desc: "Make the field required",
  },
  {
    name: "type",
    type: "constant",
    desc: "The field type from CRUD_FIELD_TYPES. Determines which property editor to render.",
  },
  {
    name: "typeConfig",
    type: "object",
    desc: "Options to configure the property editor.",
  },
  {
    name: "defaultValue",
    type: "mixed",
    default: "null",
    desc: "The default value for the field.",
  },
  {
    name: "cols",
    type: "integer",
    desc: "Number of columns the field should span. There are 12 columns per row.",
    default: "12",
  },
  {
    name: "isOpen",
    type: "bool",
    desc: "If the editor should be expanded/open by default.",
  },
];

const editors = [
  {
    name: "Text",
    desc: "A basic single-line text input.",
    crudFieldType: "TEXT",
  },
  {
    name: "Multi-Line Text",
    desc: "A basic multi-line textarea.",
    crudFieldType: "MULTILINE_TEXT",
  },
  {
    name: "Email",
    desc: "An input for a valid email address.",
    crudFieldType: "EMAIL",
  },
  {
    name: "Dropdown",
    desc: "A single selection dropdown.",
    crudFieldType: "DROPDOWN",
    options: [
      {
        name: "table",
        desc: "The table containing the lookup values. Omit if using 'options' for a hard-coded list.",
        type: "string",
      },
      {
        name: "key",
        desc: "The column in the lookup table to use as a key.",
        type: "string",
        default: "id",
      },
      {
        name: "value",
        desc: "The column in the lookup table to use as a display label.",
        type: "string",
        default: "name",
      },
      {
        name: "crud",
        desc: "Is the table crudified?",
        type: "bool",
        default: "true",
      },
      {
        name: "options",
        desc: "A hard-coded list of lookup options.",
        type: "object[]",
      },
    ],
  },
  {
    name: "Number",
    desc: "An input for a numeric value with validation and formatting options.",
    crudFieldType: "NUMBER",
    options: [
      {
        name: "min",
        desc: "The minimum number the field accepts.",
        type: "number",
      },
      {
        name: "max",
        desc: "The maximum number the field accepts.",
        type: "number",
      },
      {
        name: "lessThan",
        desc: "The number the value must be less than.",
        type: "number",
      },
      {
        name: "moreThan",
        desc: "The number the value must be more than.",
        type: "number",
      },
      {
        name: "decimalScale",
        desc: "The number of decimals shown.",
        type: "integer",
        default: "0",
      },
      {
        name: "prefix",
        desc: "The prefix to add to the start of the number.",
        type: "string",
      },
      {
        name: "suffix",
        desc: "The suffix to add to the end of the number.",
        type: "string",
      },
      {
        name: "allowNegative",
        desc: "Allow negative numbers",
        type: "bool",
        default: "true",
      },
      {
        name: "fixedDecimalScale",
        desc: "Forces decimals to be shown.",
        default: "false",
        type: "bool",
      },
      {
        name: "thousandSeparator",
        desc: "Displays the thousand separator.",
        default: "true",
        type: "bool",
      },
    ],
  },
  {
    name: "Date",
    desc: "A date only picker for date fields.",
    crudFieldType: "DATE",
    options: [
      {
        name: "variant",
        desc: "Picker container option.",
        type: "'dialog' | 'inline' | 'static'",
        default: "inline",
      },
      {
        name: "keyboard",
        desc: "Allow keyboard input and enable adornment icon.",
        type: "bool",
        default: false,
      },
      {
        name: "format",
        desc: "Format for display value.",
        type: "string",
        default: `THEME.DATE_FORMAT_SHORT (${THEME.DATE_FORMAT_SHORT})`,
      },
      {
        name: "icon",
        desc: "Show the adornment icon.",
        type: "bool",
        default: true,
      },
    ],
  },
  {
    name: "Time",
    desc: "A time only picker for time fields.",
    crudFieldType: "TIME",
    options: [
      {
        name: "variant",
        desc: "Picker container option.",
        type: "'dialog' | 'inline' | 'static'",
        default: "inline",
      },
      {
        name: "keyboard",
        desc: "Allow keyboard input and enable adornment icon.",
        type: "bool",
        default: false,
      },
      {
        name: "format",
        desc: "Format for display value.",
        type: "string",
        default: `THEME.TIME_FORMAT_SHORT (${THEME.TIME_FORMAT_SHORT})`,
      },
      {
        name: "icon",
        desc: "Show the adornment icon.",
        type: "bool",
        default: true,
      },
    ],
  },
  {
    name: "DateTime",
    desc: "A date and time picker for datetime fields.",
    crudFieldType: "DATETIME",
    options: [
      {
        name: "variant",
        desc: "Picker container option.",
        type: "'dialog' | 'inline' | 'static'",
        default: "inline",
      },
      {
        name: "keyboard",
        desc: "Allow keyboard input and enable adornment icon.",
        type: "bool",
        default: false,
      },
      {
        name: "format",
        desc: "Format for display value.",
        type: "string",
        default: `THEME.DATETIME_FORMAT_SHORT (${THEME.DATETIME_FORMAT_SHORT})`,
      },
      {
        name: "icon",
        desc: "Show the adornment icon.",
        type: "bool",
        default: true,
      },
    ],
  },
];

function Overview() {
  const theme = useTheme();
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Overview
      </Typography>
      <Typography variant="body1" gutterBottom my={4} component={"div"}>
        LRE UP has a convenient CRUD generator that helps you quickly scaffold
        new interfaces for managing data. You can access some of the generators
        via the Developer CLI:
        <Code>yarn cli</Code>
      </Typography>
      <Typography variant="h6" gutterBottom my={4}>
        Commands
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        <ul>
          {commands.map((x) => (
            <li key={x.name}>
              <strong>{x.name}</strong>
              <span style={{ color: theme.palette.text.secondary }}>
                {" "}
                &mdash; {x.desc}
              </span>
            </li>
          ))}
        </ul>
      </Typography>
    </Box>
  );
}

function SharedOptions() {
  const theme = useTheme();

  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Shared Options
      </Typography>
      <Typography variant="body1" gutterBottom my={4}>
        The following options are available on all property editors.
      </Typography>
      <ul>
        {sharedOptions.map((x) => (
          <li key={x.name}>
            <code>
              <strong>{x.name}</strong>
              {x.type && (
                <span style={{ color: theme.palette.secondary.main }}>
                  {" "}
                  ({x.type})
                </span>
              )}
            </code>
            <span style={{ color: theme.palette.text.secondary }}>
              {" "}
              &mdash; {x.desc}
              {x.default && ` [default: ${String(x.default)}]`}
            </span>
          </li>
        ))}
      </ul>
    </Box>
  );
}

function Example() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Example
      </Typography>
      <Typography variant="body1" gutterBottom my={4}>
        Here is an example <code>ModelConfig.fields</code> array:
      </Typography>
      <Paper px={4} py={1} my={4}>
        <pre>
          {`export const fields = [
  {
    name: "Contaminant",
    key: "cont_desc",
    required: true,
    cols: 6,
    isOpen: true,
    type: CRUD_FIELD_TYPES.DROPDOWN,
    typeConfig: {
      table: "contaminants",
      key: "cont_ndx",
      value: "cont_desc",
    },
  },
  {
    name: "Concentration",
    key: "conc_desc",
    required: false,
    cols: 6,
    isOpen: true,
    defaultValue: 0,
    type: CRUD_FIELD_TYPES.NUMBER,
    typeConfig: {
      min: -20,
      max: 20,
      suffix: " mg/L",
      fixedDecimalScale: 1,
      thousandSeparator: false,
    },
  },
];`}
        </pre>
      </Paper>
    </Box>
  );
}

function PropertyEditors() {
  const theme = useTheme();
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Property Editors
      </Typography>
      <Typography variant="body1" gutterBottom my={4}>
        Property Editors are the controls and inputs used to display each field.
        Each model has a <code>fields</code> array in its{" "}
        <code>
          frontend/src/pages/models/<em>Model</em>Config.js
        </code>{" "}
        file. This array dictates which fields appear when creating or editing a
        model record. Keep in mind that the{" "}
        <code>
          backend/app/models/<em>Model</em>Model.js
        </code>{" "}
        file must also contain a definition for the field, however the data type
        in the database versus the data type of the property editor is allowed
        to differ. Together, these files allow developers fine grained control
        over the scaffolding system.
      </Typography>
      {editors.map((x) => (
        <React.Fragment key={x.name}>
          <Paper px={4} py={1} my={4}>
            <Typography variant="h4" gutterBottom my={2}>
              {x.name}
            </Typography>
            <Typography variant="body1" gutterBottom my={2}>
              {x.desc}
            </Typography>
            <Divider my={4} />
            <Typography
              variant="overline"
              color="secondary"
              gutterBottom
              my={2}
            >
              CRUD_FIELD_TYPES.{x.crudFieldType}
            </Typography>
            {x.options && (
              <Typography variant="body1" gutterBottom my={2}>
                <code>fields[].typeConfig</code> options:
              </Typography>
            )}
            <ul>
              {x.options &&
                x.options.map((y) => (
                  <li key={y.name}>
                    <code>
                      <strong>{y.name}</strong>
                      {y.type && (
                        <span style={{ color: theme.palette.secondary.main }}>
                          {" "}
                          ({y.type})
                        </span>
                      )}
                    </code>
                    <span style={{ color: theme.palette.text.secondary }}>
                      {" "}
                      &mdash; {y.desc}
                      {y.default && ` [default: ${String(y.default)}]`}
                    </span>
                  </li>
                ))}
            </ul>
          </Paper>
        </React.Fragment>
      ))}
    </Box>
  );
}

function Page() {
  return (
    <React.Fragment>
      <Helmet title="CRUD" />

      <Overview />
      <PropertyEditors />
      <SharedOptions />
      <Example />
    </React.Fragment>
  );
}

export default Page;
