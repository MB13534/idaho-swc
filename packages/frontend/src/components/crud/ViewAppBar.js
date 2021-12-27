import React from "react";
import styled from "styled-components/macro";
import {
  AppBar as MuiAppBar,
  Chip,
  darken,
  Grid,
  IconButton as MuiIconButton,
  isWidthDown,
  isWidthUp,
  lighten,
  Typography,
  useTheme,
  withWidth,
} from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";
// import SplitSaveButton from "./SplitSaveButton";
import {
  CRUD_FORM_SUBMIT_TYPES,
  CRUD_VIEW_MODES,
  DIALOG_TYPES,
} from "../../constants";
import { useApp } from "../../AppProvider";
import { useHistory } from "react-router-dom";
import SplitPublishButton from "./SplitPublishButton";
import { ActionsDropdown, ActionsDropdownTypes } from "./ActionsDropdown";
// import { StatusDotRenderer, StatusHelpIconRenderer } from "./ResultsRenderers";
import { useCrud } from "../../CrudProvider";
import * as inflector from "inflected";

const AppBar = styled(MuiAppBar)`
  min-height: 72px;
  justify-content: center;
  background-color: ${(props) => props.theme.palette.background.toolbar};
  border-bottom: 1px solid
    ${(props) =>
      props.theme.palette.type === "dark"
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(0, 0, 0, 0.12)"};
  padding: ${(props) => props.theme.spacing(4)}px;

  ${(props) => props.theme.breakpoints.down("lg")} {
    max-height: none;
  }

  .backBtn {
    padding-left: ${(props) => props.theme.spacing(4)}px;
    ${(props) => props.theme.breakpoints.down("sm")} {
      padding-left: 0;
    }
  }
  .statusIcon {
    margin-left: -8px;
    margin-right: 8px;
  }
`;

const ContentTypeChip = styled(Chip)`
  margin-right: ${(props) => props.theme.spacing(4)}px;
  height: 24px;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};

  background-color: ${(props) =>
    props.theme.palette.type === "dark"
      ? darken(props.theme.palette.background.default, 0.05)
      : lighten(props.theme.palette.background.default, 0.05)} !important;
`;

const IconButton = styled(MuiIconButton)`
  margin-right: ${(props) => props.theme.spacing(2)}px;
`;

function ViewAppBar({
  data,
  // isFetching,
  modelName,
  mode,
  submitForm,
  setSubmitFormSuccessCallback,
  submitFormMode,
  setSubmitFormMode,
  triggerQueryReload,
  formIsDirty,
  displayName,
  formIsSubmitting,
  // numMismatches,
  width,
}) {
  const app = useApp();
  const crud = useCrud();
  const history = useHistory();
  const theme = useTheme();

  const modes = CRUD_FORM_SUBMIT_TYPES;

  const prepareSubmit = (myMode, callback) => {
    setSubmitFormMode(myMode);
    setSubmitFormSuccessCallback(() => (newData) => {
      callback(newData);
    });
    submitForm();
  };

  const afterClick = (newData) => {
    if (mode === CRUD_VIEW_MODES.ADD) {
      triggerQueryReload();
      history.push(`${crud.getModelBasePath()}/${newData.id}`);
      history.go(0);
    } else {
      triggerQueryReload();
    }
  };

  const afterCloseClick = () => {
    history.push(crud.getModelBasePath());
  };

  const afterNewClick = () => {
    history.push(`${crud.getModelBasePath()}/add`);
  };

  const handleBackClick = () => {
    if (formIsDirty) {
      app.setConfirmDialogKey(DIALOG_TYPES.UNSAVED);
      app.setConfirmDialogOpen(true);
    } else {
      history.push(crud.getModelBasePath());
    }
  };

  return (
    <AppBar
      color="default"
      mb={4}
      style={{
        position: "sticky",
        top: isWidthDown("xs", width) ? "56px" : "64px",
      }}
    >
      <Grid
        container
        alignItems="center"
        style={{
          flexWrap: isWidthDown("xs", width) ? "wrap" : "nowrap",
          maxHeight: isWidthDown("xs", width) ? "none" : "39px",
        }}
      >
        <Grid item className={"backBtn"}>
          <IconButton size="small" onClick={handleBackClick}>
            <ChevronLeft fontSize="large" />
          </IconButton>
        </Grid>
        {isWidthUp("md", width) && mode === CRUD_VIEW_MODES.EDIT && (
          <Grid item>
            <ContentTypeChip label={inflector.titleize(modelName)} />
          </Grid>
        )}
        {/*{mode === CRUD_VIEW_MODES.EDIT && (*/}
        {/*  <Grid item className="statusIcon">*/}
        {/*    <StatusHelpIconRenderer>*/}
        {/*      {StatusDotRenderer({ row: data }, true, theme.palette.type)}*/}
        {/*    </StatusHelpIconRenderer>*/}
        {/*  </Grid>*/}
        {/*)}*/}
        <Grid
          item
          style={{
            marginRight: "16px",
            whiteSpace: isWidthUp("sm", width) ? "nowrap" : "wrap",
            overflow: "hidden",
            flexBasis: "65%",
            flexGrow: 1,
          }}
        >
          <Typography variant="h5" className="ellipsis">
            {mode === CRUD_VIEW_MODES.ADD && (
              <span>New {inflector.titleize(modelName)}</span>
            )}
            {mode === CRUD_VIEW_MODES.EDIT && <span>{displayName}</span>}
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            // flexGrow: 1,
            marginTop: isWidthDown("xs", width) ? "8px" : 0,
            textAlign: "right",
            whiteSpace: "nowrap",
            flexWrap: "nowrap",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ActionsDropdown
            modelName={modelName}
            params={{ id: data.id, row: data }}
            type={ActionsDropdownTypes.VIEW}
            style={{ marginRight: theme.spacing(2) }}
            afterAction={() => {
              triggerQueryReload();
            }}
          />
          {/*<SplitSaveButton*/}
          {/*  numMismatches={numMismatches}*/}
          {/*  formIsDirty={formIsDirty}*/}
          {/*  formIsSubmitting={submitFormMode === modes.SAVE && formIsSubmitting}*/}
          {/*  isFetching={isFetching}*/}
          {/*  onClick={() => prepareSubmit(modes.SAVE, afterClick)}*/}
          {/*  onCloseClick={() => prepareSubmit(modes.SAVE, afterCloseClick)}*/}
          {/*  onNewClick={() => prepareSubmit(modes.SAVE, afterNewClick)}*/}
          {/*  style={{*/}
          {/*    marginRight: theme.spacing(2),*/}
          {/*    width: isWidthDown("xs", width) ? "100%" : "auto",*/}
          {/*  }}*/}
          {/*/>*/}
          <SplitPublishButton
            formIsDirty={formIsDirty}
            formIsSubmitting={
              submitFormMode === modes.PUBLISH && formIsSubmitting
            }
            onClick={() => prepareSubmit(modes.PUBLISH, afterClick)}
            onCloseClick={() => prepareSubmit(modes.PUBLISH, afterCloseClick)}
            onNewClick={() => prepareSubmit(modes.PUBLISH, afterNewClick)}
            style={{
              marginRight: theme.spacing(2),
              width: isWidthDown("xs", width) ? "100%" : "auto",
            }}
          />
        </Grid>
      </Grid>
    </AppBar>
  );
}

export default withWidth()(ViewAppBar);
