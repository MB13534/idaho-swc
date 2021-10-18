import React, { useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  isWidthDown,
  isWidthUp,
} from "@material-ui/core";
import EditForm from "./EditForm";
import { Alert as MuiAlert } from "@material-ui/lab";
import Button from "@material-ui/core/Button";
import moment from "moment";
import Chip from "@material-ui/core/Chip";
import { pluralize } from "inflected";

import styled from "styled-components/macro";
import { diffStyles } from "./DiffViewer";
import Tooltip from "@material-ui/core/Tooltip";
import { Close } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import { CONTENT_NODE_STATUS_IDS } from "../../constants";
import { ViewSidebarVersionTooltipContent } from "./ViewSidebarVersionTooltipContent";
import { formatTimeAgo } from "../../utils/date";

const maybePluralize = (str, count) => {
  return count > 1 ? pluralize(str) : str;
};

const Root = styled(Grid)`
  width: 100%;
  ${(props) =>
    props.theme.palette.type === "dark"
      ? `
  .oldVersion {
    color: ${diffStyles.variables.dark.removedColor};
    background-color: ${diffStyles.variables.dark.wordRemovedBackground};
  }
  .newVersion {
    color: ${diffStyles.variables.dark.addedColor};
    background-color: ${diffStyles.variables.dark.wordAddedBackground};
  }`
      : ""};

  ${(props) =>
    props.theme.palette.type === "light"
      ? `
  .oldVersion {
    color: ${diffStyles.variables.light.removedColor};
    background-color: ${diffStyles.variables.light.wordRemovedBackground};
  }
  .newVersion {
    color: ${diffStyles.variables.light.addedColor};
    background-color: ${diffStyles.variables.light.wordAddedBackground};
  }`
      : ""};
`;
const Alert = styled(MuiAlert)`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  & + .MuiCard-root {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

const CompareText = styled.div``;

export function ViewEditor({
  fields,
  data,
  numCompareMismatches,
  valueCache,
  setValueCache,
  currentVersion,
  setCurrentVersion,
  modelName,
  setFormIsDirty,
  setFormIsSubmitting,
  setSubmitForm,
  submitFormSuccessCallback,
  submitFormMode,
  width,
}) {
  const [fieldState, setFieldState] = useState(fields);

  const formRef = useRef();

  return (
    <Root item style={{ margin: "0 auto" }}>
      <Box p={isWidthUp("lg", width) ? 12 : isWidthUp("sm", width) ? 8 : 4}>
        {currentVersion && (
          <>
            <Alert
              icon={false}
              severity="info"
              action={
                <>
                  {numCompareMismatches > 0 && (
                    <Tooltip
                      title={`Restore ${numCompareMismatches} ${maybePluralize(
                        "changes",
                        numCompareMismatches
                      )} from ${formatTimeAgo(currentVersion.created_at)}`}
                    >
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const form = formRef.current;
                          form.setValues(currentVersion);
                          //setCurrentVersion(null);
                        }}
                      >
                        <>
                          Restore
                          <span
                            style={{
                              borderRadius: 4,
                              margin: "0 -4px 0 8px",
                              padding: "0 8px",
                              display: "inline-block",
                            }}
                            className="newVersion"
                          >
                            {" "}
                            {numCompareMismatches}
                          </span>
                        </>
                      </Button>
                    </Tooltip>
                  )}
                  {numCompareMismatches === 0 && (
                    <Tooltip title="Form Matches Compared Version">
                      <Chip
                        size="small"
                        label={"Identical"}
                        className={"filled success"}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="Cancel Comparison">
                    <IconButton
                      color="inherit"
                      size="small"
                      onClick={() => setCurrentVersion(null)}
                      style={{ marginLeft: "8px" }}
                    >
                      <Close />
                    </IconButton>
                  </Tooltip>
                </>
              }
            >
              {data.id === currentVersion.id ? (
                <CompareText>
                  <Tooltip title={"Current Form Values"}>
                    <Chip size="small" className="oldVersion" label={"Form"} />
                  </Tooltip>
                  {" vs "}
                  <Tooltip
                    title={
                      <ViewSidebarVersionTooltipContent
                        version={data}
                        showCompare={false}
                        currentVersion={currentVersion}
                      />
                    }
                  >
                    <Chip
                      size="small"
                      className="newVersion"
                      label={
                        data.status_id >= CONTENT_NODE_STATUS_IDS.PUBLISHED
                          ? "Published"
                          : "Previous"
                      }
                    />
                  </Tooltip>
                </CompareText>
              ) : (
                <CompareText>
                  <Tooltip title={"Current Form Values"}>
                    <Chip size="small" className="oldVersion" label="Form" />
                  </Tooltip>
                  {" vs "}
                  <Tooltip
                    title={
                      <ViewSidebarVersionTooltipContent
                        version={currentVersion}
                        showCompare={false}
                        currentVersion={currentVersion}
                      />
                    }
                  >
                    <Chip
                      size="small"
                      className="newVersion"
                      label={`${moment(currentVersion.created_at)
                        .add(moment().utcOffset(), "minutes")
                        .fromNow()}`}
                    />
                  </Tooltip>
                </CompareText>
              )}
            </Alert>
          </>
        )}

        <Card mb={6}>
          <CardContent>
            <Box
              p={isWidthUp("sm", width) ? 6 : 6}
              pt={isWidthUp("sm", width) ? 4 : 4}
              pr={isWidthDown("xs", width) ? 0 : 6}
              pl={isWidthDown("xs", width) ? 5 : 6}
            >
              <EditForm
                data={data}
                valueCache={valueCache}
                setValueCache={setValueCache}
                currentVersion={currentVersion}
                setCurrentVersion={setCurrentVersion}
                formRef={formRef}
                modelName={modelName}
                setFormIsDirty={setFormIsDirty}
                setFormIsSubmitting={setFormIsSubmitting}
                setSubmitForm={setSubmitForm}
                submitFormMode={submitFormMode}
                submitFormSuccessCallback={submitFormSuccessCallback}
                fields={fieldState}
                setFields={setFieldState}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Root>
  );
}
