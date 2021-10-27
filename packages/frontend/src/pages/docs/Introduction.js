import React from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import { Box, Link, Typography as MuiTypography } from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { useDocumentation } from "./DocumentationProvider";

const Typography = styled(MuiTypography)(spacing);

function Intro() {
  return (
    <Box mb={10}>
      <Typography variant="h3" gutterBottom>
        Introduction
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        LRE Water's Unified Platform (UP) is a modern CMS and Dashboard Starter
        Kit built with React, Node.js, and Material UI. UP provides a standard
        and robust starting point for any project requiring modern content
        management tools with a responsive, mobile-first design.
      </Typography>
      <Typography variant="subtitle1" gutterBottom my={4}>
        This documentation includes information to understand how the Unified
        Platform is organized, how to install and extend it to fit your needs,
        and how to contribute any valuable additions back to the core.
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

function Introduction() {
  const documentation = useDocumentation();

  return (
    <>
      <Helmet title="Introduction" />

      <Intro />
      <TableOfContents pages={documentation.pages} />
    </>
  );
}

export default Introduction;
