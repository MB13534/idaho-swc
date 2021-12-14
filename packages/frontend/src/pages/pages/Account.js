import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

// import "../../vendor/roundedBarCharts";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Card,
  Divider as MuiDivider,
  Grid as MuiGrid,
  Link,
  Typography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";
import { ROUTES } from "../../constants";
import Avatar from "@material-ui/core/Avatar";
import { ExitToApp } from "@material-ui/icons";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Grid = styled(MuiGrid)(spacing);

const tiles = [
  {
    title: "Profile",
    description: "Manage your user profile.",
    path: ROUTES.USER_PROFILE,
    icon: <Avatar />,
  },
  {
    title: "Log out",
    description: "Log out of your account.",
    path: ROUTES.USER_LOGOUT,
    icon: (
      <Avatar>
        <ExitToApp />
      </Avatar>
    ),
  },
];

function Account() {
  const history = useHistory();

  return (
    <React.Fragment>
      <Helmet title="Account" />

      <Typography variant="h3" gutterBottom display="inline">
        Account
      </Typography>

      <Grid container>
        <Grid item>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} exact to="/dashboard">
              Dashboard
            </Link>
            <Typography>Account</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        {tiles.map((tile) => (
          <Grid key={tile.title} item xs={12} md={6}>
            <Card variant="outlined">
              <CardActionArea
                onClick={() => {
                  history.push(tile.path);
                }}
              >
                <CardHeader
                  avatar={tile.icon}
                  title={tile.title}
                  subheader={tile.description}
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}

export default Account;
