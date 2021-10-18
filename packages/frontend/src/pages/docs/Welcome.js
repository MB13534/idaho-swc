import React from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import { Box, Link, Typography as MuiTypography } from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { useDocumentation } from "./DocumentationProvider";

const Typography = styled(MuiTypography)(spacing);

function Introduction() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Introduction
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        LRE Water Unified Platform is a React based CMS starter kit themed with
        Material UI. The intention is to provide a standard and robust starting
        point for any project requiring modern content management tools.
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        This documentation includes information to understand how the starter
        kit is organized, how to compile and extend it to fit your needs, and
        how to make changes to the source code.
      </Typography>
    </Box>
  );
}

function TableOfContents({ pages }) {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Table of Contents
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        <ul>
          {pages.map((x) => (
            <li key={x.title}>
              <Link component={NavLink} exact to={x.href}>
                {x.title}
              </Link>
            </li>
          ))}
        </ul>
      </Typography>
    </Box>
  );
}

function Welcome() {
  const documentation = useDocumentation();

  return (
    <>
      <Helmet title="Welcome" />

      <Introduction />
      <TableOfContents pages={documentation.pages} />
    </>
  );
}

export default Welcome;
