import React from "react";
import styled from "styled-components/macro";
import useTheme from "@material-ui/core/styles/useTheme";

import {
  Grid,
  Hidden,
  List,
  ListItemText as MuiListItemText,
  ListItem as MuiListItem,
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import DevTools from "./dev/DevTools";
import DeveloperVisibilityFilter from "./DeveloperVisibilityFilter";

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(1) / 4}px
    ${(props) => props.theme.spacing(4)}px;
  background: ${(props) => props.theme.footer.background};
  position: relative;
`;

const ListItem = styled(MuiListItem)`
  display: inline-block;
  width: auto;
  padding-left: ${(props) => props.theme.spacing(2)}px;
  padding-right: ${(props) => props.theme.spacing(2)}px;
  &,
  &:hover,
  &:active {
    color: #ff0000;
  }
`;

const ListItemText = styled(MuiListItemText)`
  span {
    color: ${(props) => props.theme.footer.color};
  }
`;

const BrandLogo = styled.img`
  width: 86px;
  height: 36px;
  margin-top: ${(props) => props.theme.spacing(3)}px;
  margin-right: ${(props) => props.theme.spacing(4)}px;
`;

function Footer() {
  const theme = useTheme();

  return (
    <Wrapper>
      <Grid container spacing={0}>
        <Hidden smDown>
          <Grid container item xs={12} md={7} justify="flex-end">
            <Grid container justify="flex-start">
              <Grid item>
                <Tooltip title="Built by LRE Water">
                  <Link
                    href="https://lrewater.com"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <BrandLogo
                      src={
                        theme.palette.type === "dark"
                          ? "/static/img/lrewater-logo-simple.svg"
                          : "/static/img/lrewater-logo-simple.svg"
                      }
                      alt={"LREWater.com"}
                    />
                  </Link>
                </Tooltip>
              </Grid>
              <Grid item>
                <List>
                  <ListItem
                    button={true}
                    component="a"
                    href="/documentation/introduction"
                  >
                    <ListItemText primary="Documentation" />
                  </ListItem>
                  <ListItem button={true} component="a" href="#">
                    <ListItemText primary="Privacy" />
                  </ListItem>
                  <ListItem button={true} component="a" href="#">
                    <ListItemText primary="Terms of Service" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Hidden>
        <Grid container item xs={12} md={5} justify="flex-end">
          <List>
            <ListItem>
              <ListItemText
                primary={`© ${new Date().getFullYear()} - Leonard Rice Engineers, Inc.`}
              />
            </ListItem>
            <DeveloperVisibilityFilter>
              <ListItem button={true}>
                <DevTools />
              </ListItem>
            </DeveloperVisibilityFilter>
          </List>
        </Grid>
      </Grid>
    </Wrapper>
  );
}

export default Footer;
