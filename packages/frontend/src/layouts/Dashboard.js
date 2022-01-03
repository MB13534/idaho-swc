import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components/macro";
import Sidebar from "../components/Sidebar";
import Header from "../components/AppBar";
import Footer from "../components/Footer";

import { spacing } from "@material-ui/system";
import {
  CssBaseline,
  Hidden,
  IconButton,
  Paper as MuiPaper,
  Snackbar,
  withWidth,
} from "@material-ui/core";

import { isWidthUp } from "@material-ui/core/withWidth";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { THEME } from "../constants";
import Alert from "@material-ui/lab/Alert";
import { useApp } from "../AppProvider";

const drawerWidth = THEME.MAIN_SIDEBAR_WIDTH;

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.palette.background.default};
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }

  .MuiMenu-paper {
    border: 1px solid ${(props) => props.theme.palette.divider};
  }

  .success {
    .MuiSvgIcon-root, .MuiTypography-root, &.MuiButton-root {
      color: ${(props) => props.theme.palette.success.main};
    }
    &.MuiButton-root {
      border-color: ${(props) => props.theme.palette.success.main};
    }
    &.MuiChip-root.filled {
      color: ${(props) => props.theme.palette.primary.contrastText};
      background-color: ${(props) => props.theme.palette.success.main};
    }
  }
  .warning {
    .MuiSvgIcon-root, .MuiTypography-root, &.MuiButton-root {
      color: ${(props) => props.theme.palette.warning.main};
    }
    &.MuiButton-root {
      border-color: ${(props) => props.theme.palette.warning.main};
    }
    &.MuiChip-root.filled {
      color: ${(props) => props.theme.palette.primary.contrastText};
      background-color: ${(props) => props.theme.palette.warning.main};
    }
  }
  .info {
    .MuiSvgIcon-root, .MuiTypography-root, &.MuiButton-root {
      color: ${(props) => props.theme.palette.info.main};
    }
    &.MuiButton-root {
      border-color: ${(props) => props.theme.palette.info.main};
    }
    &.MuiChip-root.filled {
      color: ${(props) => props.theme.palette.primary.contrastText};
      background-color: ${(props) => props.theme.palette.info.main};
    }
  }
  .error {
    .MuiSvgIcon-root, .MuiTypography-root, &.MuiButton-root {
      color: ${(props) => props.theme.palette.error.main};
    }
    &.MuiButton-root {
      border-color: ${(props) => props.theme.palette.error.main};
    }
    &.MuiChip-root.filled {
      color: ${(props) => props.theme.palette.primary.contrastText};
      background-color: ${(props) => props.theme.palette.error.main};
    }
  }

  .ellipsis {
    box-sizing: border-box;
    min-width: 0px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

    input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      textarea:-webkit-autofill,
      textarea:-webkit-autofill:hover,
      textarea:-webkit-autofill:focus,
      .MuiOutlinedInput-input:-webkit-autofill,
      .MuiOutlinedInput-input:-webkit-autofill:hover,
      .MuiOutlinedInput-input:-webkit-autofill:focus,
      select:-webkit-autofill,
      select:-webkit-autofill:hover,
      select:-webkit-autofill:focus {
       -webkit-box-shadow: 0 0 0px 1000px ${(props) =>
         props.theme.palette.type === "dark"
           ? props.theme.header.background
           : props.theme.palette.background.toolbar} inset !important;
       -webkit-text-fill-color: ${(props) =>
         props.theme.palette.type === "dark"
           ? props.theme.palette.primary.contrastText
           : props.theme.palette.text.secondary};
      }
`;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  position: relative;
  background: transparent;

  &.isClosed {
    width: 0 !important;
  }

  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  // max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const SidebarButton = styled(IconButton)`
  position: fixed;
  z-index: 1300;
  top: 86px;
  left: ${drawerWidth - 12}px;
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
  right: -12px;
`;

const SidebarToggleButtonCollapsed = styled(SidebarButton)`
  left: -1px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const Toaster = () => {
  const { toastOpen, toastMessage, toastSeverity, toastOptions, setToastOpen } =
    useApp();

  const duration = toastOptions?.persist ? null : 6000;

  return (
    <Snackbar
      open={toastOpen}
      key={toastMessage}
      onClose={() => setToastOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={duration}
    >
      <Alert
        onClose={() => setToastOpen(false)}
        variant="filled"
        severity={toastSeverity}
      >
        {toastMessage}
      </Alert>
    </Snackbar>
  );
};

const ComponentBody = ({ children, routes, width, contentWidth }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(
    JSON.parse(localStorage.getItem("isMainSidebarOpen")) ?? true
  );

  const [appContentWidth, setAppContentWidth] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (!appContentWidth) {
      if (width === "sm" || width === "xs") {
        setAppContentWidth("100%");
      } else {
        setAppContentWidth(
          drawerOpen && !mobileOpen ? "calc(100% - 258px)" : "100%"
        );
      }
    } else if (!drawerOpen) {
      setAppContentWidth("100%");
    } else if (width === "sm" || width === "xs") {
      setAppContentWidth("100%");
    } else {
      setAppContentWidth("calc(100% - 258px)");
    }
  }, [width]); // eslint-disable-line

  const toggleOpen = () => {
    localStorage.setItem("isMainSidebarOpen", (!drawerOpen).toString());
    setDrawerOpen(!drawerOpen);

    setAppContentWidth((state) =>
      state === "calc(100% - 258px)" ? "100%" : "calc(100% - 258px)"
    );
  };

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer className={!drawerOpen ? "isClosed" : ""}>
        <Hidden mdUp implementation="js">
          <Sidebar
            routes={routes}
            PaperProps={{ style: { width: drawerWidth, overflow: "visible" } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        </Hidden>
        <Hidden smDown implementation="css">
          {isWidthUp("sm", width) && drawerOpen && (
            <SidebarToggleButtonExpanded onClick={toggleOpen}>
              <ChevronLeft />
            </SidebarToggleButtonExpanded>
          )}
          {isWidthUp("sm", width) && !drawerOpen && (
            <SidebarToggleButtonCollapsed onClick={toggleOpen}>
              <ChevronRight />
            </SidebarToggleButtonCollapsed>
          )}
          <Sidebar
            routes={routes}
            width={width}
            drawerOpen={drawerOpen}
            PaperProps={{
              style: {
                width: drawerWidth,
                overflow: "visible",
                background: "none",
              },
            }}
          />
        </Hidden>
      </Drawer>
      <AppContent style={{ maxWidth: appContentWidth }}>
        <Header onDrawerToggle={handleDrawerToggle} />
        <MainContent p={contentWidth}>{children}</MainContent>
        <Footer />
        <Toaster />
      </AppContent>
    </Root>
  );
};

export const Dashboard = withWidth()(({ children, routes, width }) => {
  const contentWidth = isWidthUp("lg", width)
    ? 12
    : isWidthUp("sm", width)
    ? 8
    : 5;
  return (
    <ComponentBody routes={routes} width={width} contentWidth={contentWidth}>
      {children}
    </ComponentBody>
  );
});

export const DashboardMaxContent = withWidth()(
  ({ children, routes, width }) => {
    return (
      <ComponentBody routes={routes} width={width} contentWidth={0}>
        {children}
      </ComponentBody>
    );
  }
);
