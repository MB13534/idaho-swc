import { useSelector } from "react-redux";
import React from "react";
import { Grid, withWidth } from "@material-ui/core";
import { useQuery } from "react-query";
import Loader from "../Loader";
import { CRUD_DISPLAY_MODES } from "../../constants";
import { ResultsTable } from "./ResultsTable";
import { ResultsList } from "./ResultsList";
import { ResultsGrid } from "./ResultsGrid";
import styled from "styled-components/macro";
import * as inflector from "inflected";
import CreateModelButton from "./CreateModelButton";
import { findRecords } from "../../services/crudService";
import { ErrorCard } from "./ErrorCard";
import useService from "../../hooks/useService";
import { useApp } from "../../AppProvider";
import { useDev } from "../../DevProvider";

const Root = styled(Grid)`
  height: calc(100% - 24px);
  padding-bottom: 49px;
  ${(props) => props.theme.breakpoints.down("xs")} {
    padding-bottom: 100px;
  }
`;

function Results({ config, modelName, width, displayMode }) {
  const { doToast, lookupTableCache } = useApp();
  const dev = useDev();
  const service = useService({ toast: false });
  const endpoint = inflector.dasherize(
    inflector.underscore(inflector.pluralize(modelName))
  );
  const crud = useSelector((state) => state.crudReducer);
  const { isLoading, error, data } = useQuery(
    [`${endpoint}.index`, crud.record],
    async () => {
      try {
        let result = await service([findRecords, [modelName]]);
        dev.setRawApiData(result);
        return { data: result };
      } catch (err) {
        console.error(err);
        doToast("error", err);
      }
    },
    { keepPreviousData: true }
  );

  if (isLoading || lookupTableCache.length === 0) return <Loader />;

  if (error) return "An error has occurred: " + error.message;

  return (
    <Root container spacing={0}>
      <Grid item xs={12}>
        {data?.data?.length === 0 && (
          <ErrorCard
            title="No Records Found"
            subtitle="There were no results for your query."
            actions={
              <CreateModelButton fullWidth={false} modelName={modelName} />
            }
          />
        )}
        {data?.data?.length > 0 && (
          <>
            {displayMode === CRUD_DISPLAY_MODES.TABLE && (
              <ResultsTable
                configColumns={config.columns}
                modelName={modelName}
                data={data.data}
                endpoint={endpoint}
                width={width}
              />
            )}
            {displayMode === CRUD_DISPLAY_MODES.LIST && (
              <ResultsList
                displayName={config.displayName}
                modelName={modelName}
                data={data.data}
              />
            )}
            {displayMode === CRUD_DISPLAY_MODES.CARD && (
              <ResultsGrid
                configColumns={config.columns}
                displayName={config.displayName}
                modelName={modelName}
                data={data.data}
              />
            )}
          </>
        )}
      </Grid>
    </Root>
  );
}

export default withWidth()(Results);
