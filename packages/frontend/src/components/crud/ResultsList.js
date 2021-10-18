import CardActionArea from "@material-ui/core/CardActionArea";
import {
  CardHeader as MuiCardHeader,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { ActionsDropdown, ActionsDropdownTypes } from "./ActionsDropdown";
import React from "react";
import styled from "styled-components/macro";
import { useHistory } from "react-router-dom";
import { TimestampRenderer, ValueWithIconRenderer } from "./ResultsRenderers";

import { Home as AddressIcon, Phone as PhoneIcon } from "react-feather";
import { useCrud } from "../../CrudProvider";

const DataListItem = styled(Paper)`
  border-radius: 0;
  border-bottom: 1px solid
    ${(props) =>
      props.theme.palette.type === "dark"
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(0, 0, 0, 0.12)"};
`;

const HeaderValue = styled(Typography)`
  padding-right: ${(props) => props.theme.spacing(4)}px;
`;
const PrimaryValue = styled(Typography)`
  font-size: 0.8rem;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const CardHeader = styled(MuiCardHeader)`
  .MuiCardHeader-content {
    overflow: hidden;
  }
`;

export function ResultsList({ displayName, modelName, data }) {
  const history = useHistory();
  const crud = useCrud();

  return (
    <>
      {data.map((row) => {
        return (
          <DataListItem key={row.id}>
            <CardActionArea
              onClick={() => {
                history.push(`${crud.getModelBasePath()}/${row.id}`);
              }}
            >
              <CardHeader
                disableTypography
                avatar={
                  <ActionsDropdown
                    modelName={modelName}
                    params={{ id: row.id, row: row }}
                    type={ActionsDropdownTypes.INDEX}
                  />
                }
                title={
                  <div>
                    <Grid
                      container
                      alignItems="center"
                      style={{ overflow: "hidden" }}
                    >
                      <Grid item xs={12} sm={6} style={{ overflow: "hidden" }}>
                        <HeaderValue variant="h5">
                          <div className="ellipsis">{displayName(row)}</div>
                        </HeaderValue>
                        <PrimaryValue>{row.email}</PrimaryValue>
                      </Grid>
                      <Grid item xs={12} sm={3} style={{ overflow: "hidden" }}>
                        {ValueWithIconRenderer(
                          { value: row.phone },
                          "Phone",
                          () => (
                            <PhoneIcon />
                          )
                        )}
                        {ValueWithIconRenderer(
                          { value: row.address },
                          "Address",
                          () => (
                            <AddressIcon />
                          )
                        )}
                      </Grid>
                      <Grid item xs={12} sm={3} style={{ overflow: "hidden" }}>
                        {TimestampRenderer(row, "created")}
                        {TimestampRenderer(row, "updated")}
                      </Grid>
                    </Grid>
                  </div>
                }
              />
            </CardActionArea>
          </DataListItem>
        );
      })}
    </>
  );
}
