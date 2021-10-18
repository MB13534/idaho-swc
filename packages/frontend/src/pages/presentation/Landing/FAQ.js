import React from "react";
import styled from "styled-components/macro";

import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Container,
  Grid,
  Typography,
  Link,
} from "@material-ui/core";

import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import { spacing } from "@material-ui/system";

const Spacer = styled.div(spacing);

const Wrapper = styled.div`
  ${spacing};
  text-align: center;
`;

const TypographyOverline = styled(Typography)`
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const Accordion = styled(MuiAccordion)`
  border: 1px solid
    ${(props) =>
      props.theme.palette.type === "dark"
        ? `rgba(255, 255, 255, .15)`
        : `rgba(0, 0, 0, .15)`};
  border-radius: 6px;
  box-shadow: 0;
  text-align: left;
  margin: 16px 0 !important;

  &:before {
    display: none;
  }
`;

const AccordionSummary = styled(MuiAccordionSummary)`
  padding: 0 16px;
  box-shadow: 0;
  min-height: 48px !important;

  .MuiAccordionSummary-content {
    margin: 12px 0 !important;
  }
`;

const AccordionDetails = styled(MuiAccordionDetails)`
  padding-left: 16px;
  padding-right: 16px;
`;

function FAQ() {
  return (
    <Wrapper pt={20} pb={16}>
      <Container>
        <TypographyOverline variant="body2" gutterBottom>
          LRE Water Unified Platform
        </TypographyOverline>
        <Typography variant="h2" component="h3" gutterBottom>
          Frequently asked questions
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          The questions below have been selected from those most commonly asked
          by our clients.
        </Typography>
        <Spacer mb={8} />

        <Grid container alignItems="center" justify="center">
          <Grid item xs={12} xl={8}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq1-content"
                id="faq1-header"
              >
                <Typography variant="subtitle1">
                  How do I install LRE Water Unified Platform?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Installing LRE Water Unified Platform is as simple as cloning
                  our repository and running <code>yarn install</code>.{" "}
                  <Link
                    href="https://github.com/lre-water/up"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    View on GitHub
                  </Link>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq2-content"
                id="faq2-header"
              >
                <Typography variant="subtitle1">
                  How do I deploy to Netlify and Heroku?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Simply commit your changes and they will be automatically
                  picked up and deployed.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq3-content"
                id="faq3-header"
              >
                <Typography variant="subtitle1">
                  Does this work with npm / yarn?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Cumque eligendi expedita optio? Fuga id incidunt ipsa ipsam
                  labore mollitia nemo perspiciatis repudiandae vitae? Aliquid
                  aspernatur sequi tempore voluptate voluptates. Id.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default FAQ;
