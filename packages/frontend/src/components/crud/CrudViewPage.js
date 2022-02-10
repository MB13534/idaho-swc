import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { pluralize } from "inflected";
import {
  Grid,
  // isWidthDown,
  withWidth,
} from "@material-ui/core";
import { CRUD_FORM_SUBMIT_TYPES, CRUD_VIEW_MODES } from "../../constants";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import Loader from "../Loader";
import { ConfirmUnsavedDialog } from "./ConfirmUnsavedDialog";
import ViewAppBar from "./ViewAppBar";
import { useApp } from "../../AppProvider";
import { fetchRecord } from "../../services/crudService";
import { ViewEditor } from "./ViewEditor";
// import { ViewSidebar } from "./ViewSidebar";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import useDebounce from "../../hooks/useDebounce";
import { useDev } from "../../DevProvider";
import { ErrorCard } from "./ErrorCard";
import Button from "@material-ui/core/Button";
import { ChevronLeft } from "@material-ui/icons";
import ConfirmEvolveDialog from "./ConfirmEvolveDialog";
import ConfirmDevolveDialog from "./ConfirmDevolveDialog";
import { useCrud } from "../../CrudProvider";

const Content = styled(Grid)`
  height: calc(100% - 16px);
  display: flex;
  flex-wrap: wrap;

  ${(props) => props.theme.breakpoints.up("sm")} {
    flex-wrap: nowrap;
  }
  ${(props) => props.theme.breakpoints.down("xs")} {
    display: block;
  }
`;

function CrudViewPage({ config, width, modelName }) {
  const crudModelNameLabels = config.crudModelNameLabels;
  let { id } = useParams();
  const history = useHistory();
  const app = useApp();
  const dev = useDev();
  const crud = useCrud();

  const mode = id === "add" ? CRUD_VIEW_MODES.ADD : CRUD_VIEW_MODES.EDIT;

  const [submitFormSuccessCallback, setSubmitFormSuccessCallback] = useState(
    () => () => {}
  );

  const [submitForm, setSubmitForm] = useState(() => () => {});
  const [submitFormMode, setSubmitFormMode] = useState(
    CRUD_FORM_SUBMIT_TYPES.SAVE
  );
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [valueCache, setValueCache] = useState(null);
  const debouncedValueCache = useDebounce(valueCache, 100);
  const [numMismatches, setNumMismatches] = useState(0);
  const [numCompareMismatches, setNumCompareMismatches] = useState(0);

  const endpoint = pluralize(modelName).toLowerCase();
  const { getAccessTokenSilently } = useAuth0();
  const {
    isLoading,
    isFetching,
    error,
    data: query,
    refetch,
  } = useQuery(
    [`${endpoint}.view`, id],
    async () => {
      if (mode === CRUD_VIEW_MODES.EDIT) {
        try {
          const token = await getAccessTokenSilently();
          const data = await fetchRecord(modelName, id, token);

          // enable comparison mode automatically if changes detected
          // if (data.status_id === CONTENT_NODE_STATUS_IDS.UPDATED) {
          //   setCurrentVersion(data.parentRecord);
          // }
          return { data };
        } catch (err) {
          console.error(err);
        }
      } else {
        return { data: generateEmptyFields() };
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const generateEmptyFields = () => {
    return {
      id: "",
      ...config.fields.reduce(
        (accumulator, current) => ({
          ...accumulator,
          [current.key]: "",
        }),
        {}
      ),
    };
  };

  const triggerQueryReload = async () => {
    await refetch();
  };

  // const handleVersionViewClick = (version) => {
  //   if (currentVersion?.id === version.id) {
  //     setCurrentVersion(null);
  //   } else {
  //     if (isWidthDown("xs", width)) {
  //       window.scrollTo({ top: 0, behavior: "smooth" });
  //     }
  //     setCurrentVersion(version);
  //   }
  // };

  useEffect(() => {
    if (currentVersion && debouncedValueCache) {
      let misMatchCount = 0;
      Object.keys(currentVersion)
        .filter(
          (x) =>
            [
              "id",
              "parent_id",
              "former_parent_id",
              "future_parent_id",
              "status_id",
              "content_node_statuses",
              "created_at",
              "updated_at",
              "created_by",
              "updated_by",
              "is_latest",
              "is_published",
            ].includes(x) === false
        )
        .forEach((key) => {
          if (debouncedValueCache[key] !== currentVersion[key]) {
            // console.log(
            //   key,
            //   "debouncedValueCache[key]",
            //   debouncedValueCache[key],
            //   "didnt match",
            //   "currentVersion[key]",
            //   currentVersion[key]
            // );
            misMatchCount++;
          }
        });
      setNumCompareMismatches(misMatchCount);
    }
    if (!isLoading && query && query.data && debouncedValueCache) {
      let misMatchCount = 0;
      Object.keys(query.data)
        .filter(
          (x) =>
            [
              "id",
              "parent_id",
              "former_parent_id",
              "future_parent_id",
              "status_id",
              "content_node_statuses",
              "created_at",
              "updated_at",
              "created_by",
              "updated_by",
              "is_latest",
              "is_published",
              "version_id",
              "parent",
              "versions",
              "parentRecord",
              "total_versions",
            ].includes(x) === false
        )
        .forEach((key) => {
          if (debouncedValueCache[key] !== query.data[key]) {
            // console.log(
            //   key,
            //   "debouncedValueCache[key]",
            //   debouncedValueCache[key],
            //   "didnt match",
            //   "query.data[key]",
            //   query.data[key]
            // );
            misMatchCount++;
          }
        });
      setNumMismatches(misMatchCount);
    }
  }, [debouncedValueCache, currentVersion, query, isLoading]);

  useEffect(() => {
    if (query && query.data) dev.setRawApiData(query.data);
  }, [query, dev]);

  if (isLoading) return <Loader />;

  if (error) return "An error has occurred: " + error.message;

  if (!isLoading && (!query || !query.data)) {
    return (
      <ErrorCard
        title="Invalid Record"
        subtitle="It might have been removed."
        actions={
          <Button
            variant="contained"
            color="primary"
            startIcon={<ChevronLeft />}
            onClick={() => history.push(crud.getModelBasePath())}
          >
            Back to {crudModelNameLabels?.standard ?? modelName}
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ height: "100%" }}>
      <Helmet title={crudModelNameLabels?.standard ?? pluralize(modelName)} />

      <ConfirmUnsavedDialog
        modelName={modelName}
        open={app.confirmDialogOpen}
        setOpen={app.setConfirmDialogOpen}
      />

      <ConfirmDeleteDialog
        modelName={modelName}
        open={app.confirmDialogOpen}
        setOpen={app.setConfirmDialogOpen}
        config={config}
        afterDelete={() => {
          history.push(`${crud.getModelBasePath()}`);
        }}
      />

      <ConfirmEvolveDialog
        open={app.confirmDialogOpen}
        setOpen={app.setConfirmDialogOpen}
      />

      <ConfirmDevolveDialog
        open={app.confirmDialogOpen}
        setOpen={app.setConfirmDialogOpen}
      />

      <ViewAppBar
        data={query.data}
        isFetching={isFetching}
        mode={mode}
        modelName={modelName}
        crudModelNameLabels={crudModelNameLabels}
        submitForm={submitForm}
        submitFormMode={submitFormMode}
        setSubmitFormMode={setSubmitFormMode}
        setSubmitFormSuccessCallback={setSubmitFormSuccessCallback}
        triggerQueryReload={triggerQueryReload}
        formIsDirty={formIsDirty}
        formIsSubmitting={formIsSubmitting}
        displayName={config.displayName(query.data)}
        numMismatches={numMismatches}
      />

      <Content container spacing={0} justify={"space-between"}>
        <ViewEditor
          fields={config.fields}
          data={query.data}
          valueCache={debouncedValueCache}
          setValueCache={setValueCache}
          numCompareMismatches={numCompareMismatches}
          currentVersion={currentVersion}
          setCurrentVersion={setCurrentVersion}
          modelName={modelName}
          setFormIsDirty={setFormIsDirty}
          setFormIsSubmitting={setFormIsSubmitting}
          setSubmitForm={setSubmitForm}
          submitFormMode={submitFormMode}
          submitFormSuccessCallback={submitFormSuccessCallback}
          width={width}
        />

        {/*{mode === CRUD_VIEW_MODES.EDIT && (*/}
        {/*  <ViewSidebar*/}
        {/*    modelName={modelName}*/}
        {/*    data={query.data}*/}
        {/*    width={width}*/}
        {/*    currentVersion={currentVersion}*/}
        {/*    handleVersionViewClick={handleVersionViewClick}*/}
        {/*  />*/}
        {/*)}*/}
      </Content>
    </div>
  );
}

export default withWidth()(CrudViewPage);
