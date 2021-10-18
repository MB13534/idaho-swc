import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Results from "./Results";
import { isWidthDown, withWidth } from "@material-ui/core";
import { pluralize } from "inflected";
import { useApp } from "../../AppProvider";
import { CRUD_DISPLAY_MODES } from "../../constants";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import IndexAppBar from "./IndexAppBar";
import { useHistory } from "react-router-dom";
import { useCrud } from "../../CrudProvider";

function CrudIndexPage({ config, width, modelName }) {
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
      <Helmet title={pluralize(modelName)} />

      <ConfirmDeleteDialog
        modelName={modelName}
        displayName={config.displayName}
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
      />

      <Results
        config={config}
        modelName={modelName}
        displayMode={displayMode}
      />
    </div>
  );
}

export default withWidth()(CrudIndexPage);
