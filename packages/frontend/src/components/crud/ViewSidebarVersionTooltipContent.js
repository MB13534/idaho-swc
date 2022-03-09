import React from "react";
import styled from "styled-components/macro";
import clsx from "clsx";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { formatDate } from "../../utils/date";
import Chip from "@material-ui/core/Chip";
import { opacify } from "polished";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";

const TooltipContent = styled.div`
  text-align: center;

  & .MuiListItemText-secondary {
    color: ${(props) =>
      opacify(-0.4, props.theme.palette.primary.contrastText)};
  }

  & .MuiChip-root {
    margin-bottom: ${(props) => props.theme.spacing(2)}px;
    margin-left: ${(props) => props.theme.spacing(1)}px;
    margin-right: ${(props) => props.theme.spacing(1)}px;
    height: 24px;

    & .MuiChip-label {
      padding: 0 8px;
    }

    &.latest {
      color: ${(props) => props.theme.palette.primary.contrastText};
      background-color: ${(props) => props.theme.palette.primary.main};
    }

    &.published {
      color: ${(props) => props.theme.palette.primary.contrastText};
      background-color: ${(props) => props.theme.palette.success.main};
    }
  }

  .compareText {
    margin-top: ${(props) => props.theme.spacing(1)}px;
    display: inline-block;
  }
`;

export function ViewSidebarVersionTooltipContent({
  version,
  currentVersion,
  showCompare = false,
}) {
  const user = { nickname: "Michael Barry", picture: null };
  return (
    <TooltipContent
      className={clsx({
        latest: version.is_latest,
        published: version.is_published,
      })}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar alt={user.nickname} src={user.picture} />
        </ListItemAvatar>
        <ListItemText
          primary={"Michael Barry"}
          secondary={formatDate(version.created_at)}
        />
      </ListItem>
      {version.is_published && (
        <Chip label={"Published"} className="published" />
      )}
      {version.is_latest && <Chip label={"Last Saved"} className="latest" />}
      {showCompare && (
        <>
          <Divider />
          <Box my={2}>
            {currentVersion?.id === version.id
              ? "Click to Cancel Comparison"
              : "Click to Compare with Form Values"}
          </Box>
        </>
      )}
    </TooltipContent>
  );
}
