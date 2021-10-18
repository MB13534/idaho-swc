import React, { createContext, useContext, useEffect, useState } from "react";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import { NavLink, useHistory } from "react-router-dom";
import { ROUTES } from "../../constants";
import Paper from "@material-ui/core/Paper";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography as MuiTypography,
} from "@material-ui/core";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import { scrollWindowToTop } from "../../utils";

const pages = [
  { title: "Welcome", href: ROUTES.PAGE_DOCS_WELCOME },
  { title: "Getting Started", href: ROUTES.PAGE_DOCS_GETTING_STARTED },
  { title: "CRUD", href: ROUTES.PAGE_DOCS_CRUD },
  { title: "Support", href: ROUTES.PAGE_DOCS_SUPPORT },
  { title: "Changelog", href: ROUTES.PAGE_CHANGELOG },
];

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Typography = styled(MuiTypography)(spacing);

export const DocumentationContext = createContext();

export const useDocumentation = () => useContext(DocumentationContext);

export const DocumentationProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [page, setPage] = useState(pages[activeStep]);

  const history = useHistory();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    history.push(pages[activeStep + 1].href);
    scrollWindowToTop(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    history.push(pages[activeStep - 1].href);
    scrollWindowToTop(false);
  };

  const getNextLabel = () => {
    if (activeStep === pages.length - 1) return "";
    return (
      <>
        &nbsp; {pages[activeStep + 1].title}
        <KeyboardArrowRight />
      </>
    );
  };

  const getBackLabel = () => {
    if (activeStep === 0) return "";
    return (
      <>
        <KeyboardArrowLeft />
        {pages[activeStep - 1].title} &nbsp;
      </>
    );
  };

  useEffect(() => {
    setPage(pages[activeStep]);
  }, [activeStep]);

  useEffect(() => {
    setActiveStep(
      pages.indexOf(pages.filter((x) => x.href === window.location.pathname)[0])
    );
  }, []);

  return (
    <DocumentationContext.Provider value={{ pages }}>
      <Grid container spacing={6} justify="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Typography variant="h2" gutterBottom display="inline">
            {activeStep === 0 ? "Documentation" : page.title}
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} exact to="/dashboard">
              Dashboard
            </Link>
            <Link component={NavLink} exact to="/documentation/welcome">
              Documentation
            </Link>
            <Typography>{page.title}</Typography>
          </Breadcrumbs>

          <Divider my={6} />

          {children}
        </Grid>
      </Grid>

      <Grid container spacing={6} justify="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Paper>
            <MobileStepper
              variant="progress"
              steps={pages.length}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === pages.length - 1}
                >
                  {getNextLabel()}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  {getBackLabel()}
                </Button>
              }
            />
          </Paper>
        </Grid>
      </Grid>
    </DocumentationContext.Provider>
  );
};
