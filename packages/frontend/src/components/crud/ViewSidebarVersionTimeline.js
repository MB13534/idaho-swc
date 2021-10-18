import React from "react";
import { Timeline as MuiTimeline } from "@material-ui/lab";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import {
  AccessTime,
  BookmarkBorder as DefaultIcon,
  Close,
  KeyboardArrowDown,
  UnfoldLess,
} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import { formatTimeAgo } from "../../utils/date";
import Tooltip from "@material-ui/core/Tooltip";
import { Globe } from "react-feather";
import { ViewSidebarVersionTooltipContent } from "./ViewSidebarVersionTooltipContent";
import styled from "styled-components/macro";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import { CONFIG } from "../../constants";
import { opacify } from "polished";

const Timeline = styled(MuiTimeline)`
  padding: 0;
  margin: 0;

  .icon-wrap,
  .icon {
    vertical-align: middle;
    display: flex;
    align-self: center;
    align-items: center;
    width: 16px;
    height: 16px;
  }

  /* Safari Only Fix for Icon Position */
  @media not all and (min-resolution: 0.001dpcm) {
    @media {
      .icon {
        margin-top: -16px;
      }
    }
  }

  .icon-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .timeText {
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    font-size: 0.75rem;
    line-height: 2rem;
    user-select: none;
  }

  .hiddenVersionText {
    position: absolute;
    top: 51px; //50
    left: 27px; //44
    width: 150px;
    color: ${(props) => props.theme.palette.text.secondary};
  }

  .MuiTimelineItem-root {
    &.latest.selected .timeText {
      background-color: ${(props) =>
        opacify(-0.9, props.theme.palette.primary.main)};
    }
    &.published.selected .timeText {
      background-color: ${(props) =>
        opacify(-0.9, props.theme.palette.success.main)};
    }
    &.selected .timeText {
      background-color: ${(props) =>
        opacify(-0.8, props.theme.palette.text.primary)};
    }
    .timeText {
      margin-left: -48px;
      padding-left: 48px;
      border-radius: 16px;
      padding-top: 2px;
      padding-bottom: 2px;
      margin-top: -2px;

      &:hover {
        background-color: ${(props) => props.theme.palette.background.paper};
        cursor: pointer;
      }
    }
  }
  .MuiTimelineItem-missingOppositeContent:before {
    display: none;
  }

  .MuiIconButton-root {
    width: 24px;
    height: 24px;
    min-width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .MuiTimelineContent-root {
    padding-right: 0;
  }

  .MuiTimelineDot-root {
    padding: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .latest .MuiTimelineDot-root {
    color: ${(props) => props.theme.palette.primary.main};
    border-color: ${(props) => props.theme.palette.primary.main};
    .icon-wrap {
      color: ${(props) => props.theme.palette.primary.main};
    }
  }

  .published .MuiTimelineDot-root {
    color: ${(props) => props.theme.palette.success.main};
    border-color: ${(props) => props.theme.palette.success.main};
    .icon-wrap {
      color: ${(props) => props.theme.palette.success.main};
    }
  }

  .latest.selected .MuiTimelineDot-root {
    color: ${(props) => props.theme.palette.primary.contrastText};
    background-color: ${(props) => props.theme.palette.primary.main};
    .icon-wrap {
      color: ${(props) => props.theme.palette.primary.contrastText};
    }
  }

  .published.selected .MuiTimelineDot-root {
    color: ${(props) => props.theme.palette.primary.contrastText};
    background-color: ${(props) => props.theme.palette.success.main};
    .icon-wrap {
      color: ${(props) => props.theme.palette.primary.contrastText};
    }
  }

  .selected .MuiTimelineDot-root {
    color: ${(props) => props.theme.palette.primary.contrastText};
    background-color: ${(props) => props.theme.palette.grey[400]};
    .icon-wrap {
      color: ${(props) => props.theme.palette.primary.contrastText};
    }
  }

  .latest .timeText {
    color: ${(props) => props.theme.palette.primary.main};
  }

  .published .timeText {
    color: ${(props) => props.theme.palette.success.main};
  }
`;

export default function ViewSidebarVersionTimeline({
  data,
  currentVersion,
  handleVersionViewClick,
}) {
  return (
    <Timeline>
      {data.versions.map((version, index) => (
        <TimelineItem
          key={version.id}
          className={clsx({
            latest: version.is_latest,
            published: version.is_published,
            selected: currentVersion?.id === version.id,
          })}
        >
          <TimelineSeparator>
            <TimelineDot variant="outlined">
              <Tooltip
                enterDelay={0}
                enterTouchDelay={500}
                enterNextDelay={250}
                title={
                  <ViewSidebarVersionTooltipContent
                    version={version}
                    showCompare={true}
                    currentVersion={currentVersion}
                  />
                }
              >
                <IconButton
                  variant={
                    currentVersion?.id === version.id ||
                    version.is_latest ||
                    version.is_published
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleVersionViewClick(version)}
                >
                  {currentVersion?.id === version.id && (
                    <div className="icon-wrap">
                      <Close className="icon" />
                    </div>
                  )}
                  {currentVersion?.id !== version.id && (
                    <div className="icon-wrap">
                      {version.is_published && <Globe className="icon" />}
                      {version.is_latest && !version.is_published && (
                        <AccessTime className="icon" />
                      )}
                      {!version.is_published && !version.is_latest && (
                        <DefaultIcon className="icon" />
                      )}
                    </div>
                  )}
                </IconButton>
              </Tooltip>
            </TimelineDot>

            {index < CONFIG.VERSION_LIMIT - 1 &&
              index < data.versions.length - 1 && <TimelineConnector />}
            {data.versions.length > CONFIG.VERSION_LIMIT &&
              index === data.versions.length - 2 && (
                <>
                  <TimelineConnector style={{ height: "5px" }} />
                  <UnfoldLess />{" "}
                  <Typography variant="caption" className="hiddenVersionText">
                    More Versions
                  </Typography>
                  <TimelineConnector style={{ height: "5px" }} />
                </>
              )}

            {data.total_versions > CONFIG.VERSION_LIMIT &&
              index === data.versions.length - 1 && (
                <>
                  <TimelineConnector style={{ height: "5px" }} />
                  <KeyboardArrowDown />{" "}
                  <Typography variant="caption" className="hiddenVersionText">
                    +{data.total_versions - CONFIG.VERSION_LIMIT} Older Versions
                  </Typography>
                </>
              )}
          </TimelineSeparator>
          <TimelineContent>
            <Tooltip
              enterDelay={0}
              enterTouchDelay={0}
              enterNextDelay={250}
              title={
                <ViewSidebarVersionTooltipContent
                  version={version}
                  showCompare={true}
                  currentVersion={currentVersion}
                />
              }
            >
              <Typography
                variant="body1"
                className="timeText"
                onClick={() => handleVersionViewClick(version)}
              >
                {formatTimeAgo(version.created_at)}
              </Typography>
            </Tooltip>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
