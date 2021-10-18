import React, { useState } from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";
import { spacing } from "@material-ui/system";
import { Helmet } from "react-helmet-async";
import {
  Grid,
  Button as MuiButton,
  Collapse,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography,
  CardContent,
  Card as MuiCard,
  CardHeader as MuiCardHeader,
  Tooltip,
} from "@material-ui/core";
import CodeIcon from "@material-ui/icons/Code";
import ClipboardIcon from "@material-ui/icons/Assignment";
import Code from "../../components/Code";
import clsx from "clsx";
import { useApp } from "../../AppProvider";

// eslint-disable-next-line import/no-webpack-loader-syntax
import AlertsCode from "!!raw-loader!./examples/Alerts";
// eslint-disable-next-line import/no-webpack-loader-syntax
import ButtonsCode from "!!raw-loader!./examples/Buttons";
// eslint-disable-next-line import/no-webpack-loader-syntax
import ChartsCode from "!!raw-loader!./examples/Charts";
// eslint-disable-next-line import/no-webpack-loader-syntax
import TablesCode from "!!raw-loader!./examples/Tables";
// eslint-disable-next-line import/no-webpack-loader-syntax
import IconsMaterialCode from "!!raw-loader!./examples/IconsMaterial";

import Alerts from "./examples/Alerts";
import Buttons from "./examples/Buttons";
import Tables from "./examples/Tables";
import IconsMaterial from "./examples/IconsMaterial";
import Charts from "./examples/Charts";

export const EXAMPLE_COMPONENTS = [
  {
    title: "Alerts",
    subtitle:
      "Alerts offer four severity levels that set a distinctive icon and color.",
    component: Alerts,
    code: AlertsCode,
  },
  {
    title: "Buttons",
    subtitle:
      "Buttons are available in a variety of styles, colors, and configurations.",
    component: Buttons,
    code: ButtonsCode,
  },
  {
    title: "Charts",
    subtitle:
      "Charts are available in a variety of types, configurations, and colors via Chartjs.",
    component: Charts,
    code: ChartsCode,
  },
  {
    title: "Tables",
    subtitle:
      "Tables display information in a way that's easy to scan, so that users can look for patterns and insights.",
    component: Tables,
    code: TablesCode,
  },
  {
    title: "Icons",
    subtitle: "Icons from @material-ui/icons package.",
    component: IconsMaterial,
    code: IconsMaterialCode,
  },
];

const Card = styled(MuiCard)(spacing);

const CardHeader = styled(MuiCardHeader)`
  flex-wrap: wrap;

  .MuiCardHeader-action {
    margin-top: ${(props) => props.theme.spacing(2)}px;
    align-self: flex-end;
  }
`;

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Button = styled(MuiButton)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  &.expand .MuiButton-endIcon {
    transform: rotate(0deg);
    transition: ${(props) =>
      props.theme.transitions.create("transform", {
        duration: props.theme.transitions.duration.shortest,
      })};
  }
  &.expandOpen .MuiButton-endIcon {
    transform: rotate(180deg);
  }
`;

function CardComponent({
  title,
  subtitle,
  component: Component,
  code: ComponentCode,
}) {
  const [expanded, setExpanded] = useState(false);
  const { doToast } = useApp();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card mb={6}>
      <CardHeader
        title={title}
        subheader={subtitle}
        action={
          <>
            <Tooltip title="Copy to Clipboard">
              <Button
                variant="outlined"
                onClick={() => {
                  if (window.isSecureContext) {
                    navigator.clipboard.writeText(ComponentCode.toString());
                    doToast("info", "Code has been copied to clipboard.");
                  } else {
                    doToast("warning", "Insecure context, copy may not work.");
                  }
                }}
              >
                <ClipboardIcon />
              </Button>
            </Tooltip>
            <Tooltip title="View Source Code">
              <Button
                variant={expanded ? "contained" : "outlined"}
                className={clsx("expand", {
                  expandOpen: expanded,
                })}
                onClick={handleExpandClick}
              >
                <CodeIcon />
              </Button>
            </Tooltip>
          </>
        }
      />
      <CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Code>{ComponentCode.toString()}</Code>
        </Collapse>
        {Component}
      </CardContent>
    </Card>
  );
}

function AllComponents() {
  return EXAMPLE_COMPONENTS.map((x) => (
    <ComponentExample key={x.title} x={x} />
  ));
}

function ComponentExample({ x }) {
  if (!x) return null;
  return (
    <Card key={x.title} mb={6}>
      <CardComponent
        title={x.title}
        subtitle={x.subtitle}
        component={<x.component />}
        code={x.code}
      />
    </Card>
  );
}
export function All({ exampleComponent }) {
  const pageTitle = exampleComponent
    ? exampleComponent.title
    : "All Components";

  return (
    <React.Fragment>
      <Helmet title={pageTitle} />

      <Typography variant="h2" gutterBottom display="inline">
        {pageTitle}
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Link component={NavLink} exact to="/components/all">
          Components
        </Link>
        <Typography>{pageTitle}</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <>
            {exampleComponent && <ComponentExample x={exampleComponent} />}
            {!exampleComponent && <AllComponents />}
          </>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
