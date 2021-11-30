import React, { useState } from "react";
import {
  CONTENT_NODE_STATUS_DESCRIPTIONS,
  CONTENT_NODE_STATUS_NAMES,
  THEME,
} from "../../constants";
import { Chip as MuiChip, darken, lighten, useTheme } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import moment from "moment";
import styled from "styled-components/macro";
import { ActionsDropdown } from "./ActionsDropdown";
import { underscore } from "inflected";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Visibility } from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import { useApp } from "../../AppProvider";

const Chip = styled(MuiChip)`
  &.MuiChip-root {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 90px;
    height: 24px;
    cursor: pointer;
    background-color: ${(props) => props.theme.palette.background.default};
    color: ${(props) => props.theme.palette.text.secondary};
  }

  &.status {
    width: 70px;
    text-align: center;
    .MuiChip-label {
      padding-left: 0;
      padding-right: 0;
    }
  }

  &.draft.light {
    color: ${(props) => darken(props.theme.palette.warning.main, 0.3)};
    background-color: ${(props) =>
      lighten(props.theme.palette.warning.main, 0.85)};
  }
  &.published.light {
    color: ${(props) => darken(props.theme.palette.success.main, 0.3)};
    background-color: ${(props) =>
      lighten(props.theme.palette.success.main, 0.85)};
  }
  &.updated.light {
    color: ${(props) => darken(props.theme.palette.info.main, 0.3)};
    background-color: ${(props) =>
      lighten(props.theme.palette.info.main, 0.85)};
  }

  &.draft.dark {
    color: ${(props) => lighten(props.theme.palette.warning.main, 0.3)};
  }
  &.published.dark {
    color: ${(props) => lighten(props.theme.palette.success.main, 0.3)};
  }
  &.updated.dark {
    color: ${(props) => lighten(props.theme.palette.info.main, 0.3)};
  }
`;

const Dot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 8px;

  background-color: ${(props) => props.theme.palette.background.default};
  color: ${(props) =>
    props.theme.palette.type === "dark"
      ? props.theme.palette.text.secondary
      : "rgb(72, 84, 130)"};

  &.draft.light {
    background-color: ${(props) =>
      lighten(props.theme.palette.warning.main, 0.3)};
  }
  &.published.light {
    background-color: ${(props) =>
      lighten(props.theme.palette.success.main, 0.3)};
  }
  &.updated.light {
    background-color: ${(props) => lighten(props.theme.palette.info.main, 0.3)};
  }

  &.draft.dark {
    background-color: ${(props) =>
      lighten(props.theme.palette.warning.main, 0.3)};
  }
  &.published.dark {
    background-color: ${(props) =>
      lighten(props.theme.palette.success.main, 0.3)};
  }
  &.updated.dark {
    background-color: ${(props) => lighten(props.theme.palette.info.main, 0.3)};
  }
`;

const StatusHeaderTooltip = styled((props) => (
  <Tooltip
    classes={{ popper: props.className, tooltip: "tooltip" }}
    {...props}
  />
))`
  & .tooltip {
    padding: ${(props) => props.theme.spacing(2)}px;
  }
`;

const MicroUserIcon = styled(Avatar)`
  width: ${(props) => props.theme.spacing(4)}px;
  height: ${(props) => props.theme.spacing(4)}px;
  margin-right: ${(props) => props.theme.spacing(2)}px;
`;

const SecondaryValue = styled(Typography)`
  font-size: 0.7rem;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const IconWrap = styled.div`
  & svg {
    width: ${(props) => props.theme.spacing(4)}px;
    height: ${(props) => props.theme.spacing(4)}px;
    margin-right: ${(props) => props.theme.spacing(2)}px;
    vertical-align: middle;
    color: ${(props) =>
      props.theme.palette.type === "dark" ? grey[600] : grey[400]};
  }
`;

export function AssociatedFieldRenderer(params) {
  if (params.field.includes(".")) {
    const [obj, prop] = params.field.split(".");
    return obj && prop && params.row[obj]
      ? params.row[obj][prop]
      : params.value;
  } else {
    return params.value;
  }
}

export function IdRenderer(params) {
  return (
    <div>
      <Tooltip title={params.value}>
        <Chip label={params.value} />
      </Tooltip>
    </div>
  );
}

export function ActionsRenderer(params, modelName, type) {
  return <ActionsDropdown params={params} modelName={modelName} type={type} />;
}

export function TimestampRenderer(params, type) {
  const value = type === "created" ? params.created_at : params.updated_at;
  const label = type === "created" ? "Created" : "Last Updated";
  const username = "Foo Bar"; // TODO: dkulak: Make this pull the real user
  const date = DateRenderer({ value });
  return (
    <Grid
      container
      spacing={0}
      justify={"flex-start"}
      alignItems={"center"}
      style={{
        flexWrap: "nowrap",
        textOverflow: "ellipsis",
        padding: "2px",
      }}
    >
      <Grid item>
        <Tooltip title={`${label} by ${username}`}>
          <MicroUserIcon />
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title={`${label} at ${date}`}>
          <SecondaryValue noWrap>{date}</SecondaryValue>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export function ValueWithIconRenderer(params, label, Icon) {
  if (!params.value) return;
  return (
    <Grid
      container
      spacing={0}
      justify={"flex-start"}
      alignItems={"center"}
      style={{
        flexWrap: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        padding: "2px",
      }}
    >
      <Grid item>
        <Tooltip title={label}>
          <IconWrap>
            <Icon />
          </IconWrap>
        </Tooltip>
      </Grid>
      <Grid item style={{ overflow: "hidden" }}>
        <SecondaryValue className={"ellipsis"} noWrap>
          {params.value}
        </SecondaryValue>
      </Grid>
    </Grid>
  );
}

export function DateRenderer(params) {
  let date = moment(params.value)
    .add(moment().utcOffset(), "minutes")
    .format(THEME.DATE_FORMAT_LONG);
  if (date === "Invalid date") {
    date = <>&mdash;</>;
  }
  return date;
}

export function StatusHelpIconRenderer({ children, ...params }) {
  if (!children)
    children = (
      <Visibility
        style={{ fontSize: "1rem", marginLeft: "2px", color: "#ccc" }}
      />
    );

  const theme = useTheme();
  const [themeType] = useState(theme.palette.type);

  return (
    <StatusHeaderTooltip
      title={
        <div>
          <Grid container spacing={2}>
            <Grid item xs={1} style={{ paddingTop: "6px" }}>
              <Dot
                className={`${underscore("published")} ${underscore(
                  themeType
                )}`}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="body1">
                {CONTENT_NODE_STATUS_NAMES.PUBLISHED}
              </Typography>
              <Typography variant="caption">
                {CONTENT_NODE_STATUS_DESCRIPTIONS.PUBLISHED}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={1}>
              <Dot
                className={`${underscore("updated")} ${underscore(themeType)}`}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="body1">
                {CONTENT_NODE_STATUS_NAMES.UPDATED}
              </Typography>
              <Typography variant="caption">
                {CONTENT_NODE_STATUS_DESCRIPTIONS.UPDATED}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={1}>
              <Dot
                className={`${underscore("draft")} ${underscore(themeType)}`}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="body1">
                {CONTENT_NODE_STATUS_NAMES.DRAFT}
              </Typography>
              <Typography variant="caption">
                {CONTENT_NODE_STATUS_DESCRIPTIONS.DRAFT}
              </Typography>
            </Grid>
          </Grid>
        </div>
      }
    >
      {children}
    </StatusHeaderTooltip>
  );
}

export function StatusDotRenderer(
  params,
  disableTooltip = false,
  themeType = "light"
) {
  const status = params.row?.content_node_statuses?.name;

  if (!status) return;

  return (
    <div>
      <Tooltip title={disableTooltip ? "" : status}>
        <Dot className={`${underscore(status)} ${underscore(themeType)}`} />
      </Tooltip>
    </div>
  );
}

export const DropdownValueRenderer = (params) => {
  const { lookupTableCache } = useApp();

  let returnValue = params.value;

  if (
    params.colDef.lookupModel &&
    params.colDef.lookupKey &&
    params.colDef.lookupValue
  ) {
    const cacheEntry = lookupTableCache[params.colDef.lookupModel].find(
      (x) => x[params.colDef.lookupKey] === params.value
    );

    if (cacheEntry) returnValue = cacheEntry[params.colDef.lookupValue];
  }

  return <span>{returnValue}</span>;
};

export const Renderers = {
  AssociatedFieldRenderer,
  IdRenderer,
  ActionsRenderer,
  StatusDotRenderer,
  DropdownValueRenderer,
  StatusHelpIconRenderer,
  TimestampRenderer,
  ValueWithIconRenderer,
  DateRenderer,
};
