import React from "react";
import styled from "styled-components/macro";

import {
  Container,
  Grid,
  Typography as MuiTypography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { BackgroundVideo } from "../../../components/BackgroundVideo";

const Typography = styled(MuiTypography)(spacing);

const Wrapper = styled.div`
  padding-top: 7rem;
  position: relative;
  text-align: center;
  overflow: hidden;
  height: 450px;

  color: ${(props) =>
    props.theme.palette.type === "dark"
      ? props.theme.palette.text.secondary
      : props.theme.palette.text.primary};
`;

const Content = styled.div`
  position: relative;
  padding: ${(props) => props.theme.spacing(6)}px 0;
  line-height: 150%;
`;

const Subtitle = styled(Typography)`
  font-size: ${(props) => props.theme.typography.h6.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  font-family: ${(props) => props.theme.typography.fontFamily};
  margin: ${(props) => props.theme.spacing(2)}px 0;

  color: ${(props) =>
    props.theme.palette.type === "dark"
      ? props.theme.palette.text.secondary
      : props.theme.palette.text.secondary};
`;

const BrandLogo = styled.img`
  vertical-align: middle;
  max-height: 100%;
  max-width: 100%;
`;

function Introduction() {
  return (
    <Wrapper>
      <Container>
        <Grid container alignItems="center" justify="center" spacing={4}>
          <Grid item xs={10} sm={9} md={8} lg={7}>
            <BackgroundVideo mp4={"/static/video/1048072384-preview.mp4"} />
            <Content>
              <BrandLogo src="/static/img/clearwater-logo-full.png" />
              <Grid container justify="center" spacing={4}>
                <Grid item xs={12} lg={10}>
                  <Subtitle color="textSecondary">
                    Enter and analyze data. <br />
                    Access and visualize wells & properties. <br />
                    View reports & analytics. <br />
                  </Subtitle>
                </Grid>
              </Grid>
            </Content>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default Introduction;
