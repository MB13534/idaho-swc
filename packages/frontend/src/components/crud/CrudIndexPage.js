import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Results from "./Results";
import { isWidthDown, withWidth } from "@material-ui/core";
import { useApp } from "../../AppProvider";
import { CRUD_DISPLAY_MODES } from "../../constants";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import IndexAppBar from "./IndexAppBar";
import { useHistory } from "react-router-dom";
import { useCrud } from "../../CrudProvider";
import { pluralize } from "inflected";

function CrudIndexPage({ config, width, modelName }) {
  const crudModelNameLabels = config.crudModelNameLabels;
  const app = useApp();
  const crud = useCrud();
  const history = useHistory();

  const [displayMode, setDisplayMode] = useState(
    localStorage.getItem(`crudViewResultDisplayMode_${modelName}`) ??
      (isWidthDown("xs", width)
        ? CRUD_DISPLAY_MODES.LIST
        : CRUD_DISPLAY_MODES.TABLE)
  );

  return (
    <div style={{ height: "100%" }}>
      <Helmet title={crudModelNameLabels?.standard ?? pluralize(modelName)} />

      <ConfirmDeleteDialog
        modelName={modelName}
        config={config}
        open={app.confirmDialogOpen}
        setOpen={app.setConfirmDialogOpen}
        afterDelete={() => {
          history.push(`${crud.getModelBasePath()}`);
        }}
      />

      <IndexAppBar
        modelName={modelName}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        crudModelNameLabels={crudModelNameLabels}
      />

      <Results
        config={config}
        modelName={modelName}
        crudModelNameLabels={crudModelNameLabels}
        displayMode={displayMode}
      />
    </div>
  );
}

export default withWidth()(CrudIndexPage);
