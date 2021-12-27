import React, { useState } from "react";
import styled from "styled-components/macro";
import {
  Grid,
  IconButton as MuiIconButton,
  isWidthDown,
  isWidthUp,
  Slide,
} from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import ViewSidebarContent from "./ViewSidebarContent";

const IconButton = styled(MuiIconButton)`
  margin-right: ${(props) => props.theme.spacing(4)}px;
`;

const ContentWrap = styled.div`
  width: 240px;
  height: 100%;
  background-color: ${(props) => props.theme.palette.background.toolbar2};
  border-left: 1px solid
    ${(props) =>
      props.theme.palette.type === "dark"
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(0, 0, 0, 0.12)"};
  padding: ${(props) => props.theme.spacing(4)}px;

  ${(props) => props.theme.breakpoints.down("xs")} {
    width: 100%;
  }
`;

const SidebarButton = styled(IconButton)`
  position: absolute;
  top: 20px;
  width: 24px;
  height: 24px;
  border: 1px solid
    ${(props) =>
      props.theme.palette.type === "dark"
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(0, 0, 0, 0.2)"};
  background-color: ${(props) =>
    props.theme.palette.background.default} !important;

  &:hover {
    background-color: ${(props) =>
      props.theme.palette.background.toolbar} !important;
  }
`;

const SidebarToggleButtonExpanded = styled(SidebarButton)`
  left: -15px;
`;

const SidebarToggleButtonCollapsed = styled(SidebarButton)`
  right: -16px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;

export function ViewSidebar({
  modelName,
  data,
  handleVersionViewClick,
  currentVersion,
  width,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    JSON.parse(localStorage.getItem("isCrudViewSidebarOpen")) ?? false
  );

  const toggleOpen = () => {
    localStorage.setItem("isCrudViewSidebarOpen", (!isSidebarOpen).toString());
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Grid item style={{ position: "relative" }}>
      {isWidthUp("sm", width) && (
        <>
          {isSidebarOpen && (
            <SidebarToggleButtonExpanded onClick={toggleOpen}>
              <ChevronRight />
            </SidebarToggleButtonExpanded>
          )}
          {!isSidebarOpen && (
            <SidebarToggleButtonCollapsed onClick={toggleOpen}>
              <ChevronLeft />
            </SidebarToggleButtonCollapsed>
          )}
        </>
      )}
      <Slide
        timeout={0}
        direction="left"
        in={isSidebarOpen || isWidthDown("xs", width)}
        mountOnEnter
        unmountOnExit
      >
        <ContentWrap>
          <ViewSidebarContent
            modelName={modelName}
            data={data}
            currentVersion={currentVersion}
            handleVersionViewClick={handleVersionViewClick}
          />
        </ContentWrap>
      </Slide>
    </Grid>
  );
}
