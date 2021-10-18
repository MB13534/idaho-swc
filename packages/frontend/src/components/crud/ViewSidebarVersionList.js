import React from "react";
import styled from "styled-components/macro";
import Button from "@material-ui/core/Button";
import { AccessTime, Close, CompareArrows } from "@material-ui/icons";
import { Grid } from "@material-ui/core";
import clsx from "clsx";
import { Globe } from "react-feather";
import Tooltip from "@material-ui/core/Tooltip";
import { formatTimeAgo } from "../../utils/date";
import { ViewSidebarVersionTooltipContent } from "./ViewSidebarVersionTooltipContent";

const GridRow = styled(Grid)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
  flex-wrap: nowrap;

  & .latest {
    color: ${(props) => props.theme.palette.primary.main};
  }

  & .published {
    color: ${(props) => props.theme.palette.success.main};
  }
`;

const GridKey = styled(Grid)`
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  font-size: 0.75rem;
  padding-right: 16px;

  > div {
    display: flex;
  }

  & .icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
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

  & .MuiButtonBase-root {
    padding: 4px;
    width: 32px;
    min-width: 32px;
    height: 28px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export function ViewSidebarVersionList({
  data,
  currentVersion,
  handleVersionViewClick,
}) {
  return (
    <React.Fragment>
      {data.versions.map((version, index) => (
        <React.Fragment key={index}>
          <GridRow
            key={version.id}
            container
            justify="space-between"
            alignItems="center"
          >
            <GridKey
              item
              className={clsx({
                latest: version.is_latest,
                published: version.is_published,
              })}
            >
              <>
                <Tooltip
                  title={
                    <ViewSidebarVersionTooltipContent
                      version={version}
                      currentVersion={currentVersion}
                    />
                  }
                >
                  <div>
                    {version.is_published && <Globe className="icon" />}
                    {version.is_latest && <AccessTime className="icon" />}
                    {formatTimeAgo(version.created_at)}
                  </div>
                </Tooltip>
              </>
            </GridKey>
            <GridValue item>
              <Tooltip
                title={
                  currentVersion?.id === version.id
                    ? "Cancel Comparison"
                    : "Compare this version with current Form Values"
                }
              >
                <Button
                  size="small"
                  variant={
                    currentVersion?.id === version.id ? "contained" : "outlined"
                  }
                  color={
                    currentVersion?.id === version.id
                      ? "secondary"
                      : "secondary"
                  }
                  onClick={() => handleVersionViewClick(version)}
                >
                  {currentVersion?.id === version.id && (
                    <Close fontSize="small" />
                  )}
                  {currentVersion?.id !== version.id && (
                    <CompareArrows fontSize="small" />
                  )}
                </Button>
              </Tooltip>
            </GridValue>
          </GridRow>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
