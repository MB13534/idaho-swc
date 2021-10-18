import React from "react";
import styled from "styled-components/macro";
import { opacify } from "polished";
import { customDark } from "../theme/variants";

const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  background-color: ${(props) =>
    props.theme.palette.type === "dark"
      ? opacify(-0.15, props.theme.palette.background.default)
      : opacify(-0.25, props.theme.palette.background.default)};

  box-shadow: ${(props) =>
    props.theme.palette.type === "dark"
      ? `inset 0 0 100px ${props.theme.header.background}`
      : `inset 0 0 100px ${customDark[900]}`};

  .video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
`;

const VideoBg = styled.div`
  position: absolute;
  z-index: -2;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: ${(props) => props.theme.header.background};
`;

export function BackgroundVideo({ mp4 }) {
  return (
    <Root>
      <video className={"video"} autoPlay muted loop preload="auto" playsInline>
        <source src={mp4} type="video/mp4" />
      </video>
      <VideoBg />
    </Root>
  );
}
