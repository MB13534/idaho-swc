import React, { useState } from "react";
import styled from "styled-components/macro";
import { Chip as MuiChip, Grid, Snackbar, Typography } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import useTheme from "@material-ui/core/styles/useTheme";
import Box from "@material-ui/core/Box";
import { useApp } from "../../AppProvider";
import { StatusDotRenderer, StatusHelpIconRenderer } from "./ResultsRenderers";
import Avatar from "@material-ui/core/Avatar";
import { useAuth0 } from "@auth0/auth0-react";
import { formatDate } from "../../utils/date";
import ViewSidebarVersionTimeline from "./ViewSidebarVersionTimeline";
import * as inflector from "inflected";

const HeaderText = styled(Typography)`
  text-transform: uppercase;
  font-weight: ${(props) => props.theme.typography.fontWeightXBold};
  font-size: 0.8rem;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const GridRow = styled(Grid)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
  flex-wrap: nowrap;
`;

const GridKey = styled(Grid)`
  font-size: 0.7rem;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
`;

const GridValue = styled(Grid)`
  text-align: right;
  flex-grow: 1;
  color: ${(props) => props.theme.palette.text.secondary};
  font-size: 0.7rem;
  &.MuiTypography-root {
    font-size: 0.2rem;
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

const GridDot = styled(Grid)`
  display: flex;
  align-items: center;
  padding-left: ${(props) => props.theme.spacing(2)}px;
`;

const IdChip = styled(MuiChip)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 180px;
  height: 16px;
  font-size: 0.7rem;
`;

const TypeChip = styled(MuiChip)`
  &.MuiChip-root {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    height: 16px;
    font-size: 0.7rem;
    background-color: ${(props) => props.theme.palette.background.paper};
  }
`;

const TimestampAvatar = styled(Avatar)`
  width: 16px;
  height: 16px;
`;

function ViewSidebarContent({
  modelName,
  data,
  currentVersion,
  handleVersionViewClick,
}) {
  const theme = useTheme();
  const { user } = useAuth0();
  const { doToast } = useApp();
  const [toastOpen, setToastOpen] = useState(false);

  const createdBy = user.name;
  const updatedBy = createdBy;

  return (
    <div>
      <HeaderText variant="overline">Record Details</HeaderText>
      <Divider
        style={{ marginTop: theme.spacing(-2), marginBottom: theme.spacing(2) }}
      />
      <Grid container spacing={0}>
        <GridRow container justify="space-between" alignItems="center">
          <GridKey item>ID</GridKey>
          <GridValue item>
            <Tooltip
              title="Copy to Clipboard"
              onClick={() => {
                if (window.isSecureContext) {
                  navigator.clipboard.writeText(data.id);
                  doToast("info", "Value has been copied to clipboard.");
                } else {
                  doToast("warning", "Insecure context, copy may not work.");
                }
              }}
            >
              <IdChip label={data.id} />
            </Tooltip>
          </GridValue>
        </GridRow>

        <GridRow container justify="space-between" alignItems="center">
          <GridKey item>Model</GridKey>
          <GridValue item>
            <TypeChip label={inflector.titleize(modelName)} />
          </GridValue>
        </GridRow>
        <GridRow container justify="space-between" alignItems="center">
          <GridKey item>Created</GridKey>
          <GridValue item>
            {data.created_at ? formatDate(data.created_at) : <>&mdash;</>}
          </GridValue>
          <GridDot item>
            <Tooltip title={`Created by ${createdBy}`}>
              <TimestampAvatar src={user.picture} alt={user.name} />
            </Tooltip>
          </GridDot>
        </GridRow>
        <GridRow container justify="space-between" alignItems="center">
          <GridKey item>Updated</GridKey>
          <GridValue item>
            {data.updated_at ? formatDate(data.updated_at) : <>&mdash;</>}
          </GridValue>
          <GridDot item>
            <Tooltip title={`Updated by ${updatedBy}`}>
              <TimestampAvatar src={user.picture} alt={user.name} />
            </Tooltip>
          </GridDot>
        </GridRow>
        <GridRow container item justify="space-between" alignItems="center">
          <GridKey item>Status</GridKey>
          <GridValue item>{data?.content_node_statuses?.name} </GridValue>
          <GridDot item>
            <StatusHelpIconRenderer>
              {StatusDotRenderer({ row: data }, true)}
            </StatusHelpIconRenderer>
          </GridDot>
        </GridRow>
      </Grid>

      <Box p={2} />

      {data.versions?.length > 0 && (
        <>
          <HeaderText variant="overline">Version Timeline</HeaderText>
          <Divider
            style={{
              marginTop: theme.spacing(-2),
              marginBottom: theme.spacing(2),
            }}
          />
          <Grid container spacing={0}>
            {!data.versions.length && <>No versions found.</>}

            {data.versions.length > 0 && (
              <ViewSidebarVersionTimeline
                data={data}
                currentVersion={currentVersion}
                handleVersionViewClick={handleVersionViewClick}
              />
            )}
          </Grid>
        </>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message="Value has been copied to clipboard."
      />
    </div>
  );
}

export default ViewSidebarContent;
