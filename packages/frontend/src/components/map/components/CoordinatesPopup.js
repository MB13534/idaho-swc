import React from "react";
import { Tooltip } from "@material-ui/core";
import styled from "styled-components/macro";

const CoordinatesContainer = styled.pre`
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  position: absolute;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  z-index: 1000;
  display: none;
`;

const Coord = styled.span`
  cursor: copy;
`;

const MarginLeft = styled.span`
  margin-left: 10px;
`;

// For routes that can only be accessed by admin users
const CoordinatesPopup = ({
  coordinatesContainerRef,
  longRef,
  latRef,
  eleRef,
  title = "Most recently selected marker:",
  top = "10px",
  left = "49px",
}) => {
  return (
    <>
      <CoordinatesContainer ref={coordinatesContainerRef} top={top} left={left}>
        <strong>{title}</strong>
        <div>
          <MarginLeft>
            <strong>Longitude: </strong>
          </MarginLeft>
          <Tooltip title="Copy Longitude to Clipboard">
            <Coord ref={longRef} />
          </Tooltip>
        </div>
        <div>
          <MarginLeft>
            <strong>Latitude: </strong>
          </MarginLeft>
          <Tooltip title="Copy Latitude to Clipboard" placement="bottom-start">
            <Coord ref={latRef} />
          </Tooltip>
        </div>
        <div>
          <MarginLeft>
            <strong>Elevation: </strong>
          </MarginLeft>
          <Tooltip title="Copy Elevation to Clipboard" placement="bottom-start">
            <Coord ref={eleRef} />
          </Tooltip>{" "}
          ft
        </div>
      </CoordinatesContainer>
    </>
  );
};

export default CoordinatesPopup;
