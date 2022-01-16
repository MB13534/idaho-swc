import React from "react";
import { Tooltip } from "@material-ui/core";
import styled from "styled-components/macro";

const MeasurementsContainer = styled.pre`
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  position: absolute;
  bottom: 30px;
  right: 49px;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  z-index: 1000;
  display: none;
`;

const Measurement = styled.div`
  cursor: copy;
  margin-left: 10px;
`;

// For routes that can only be accessed by admin users
const MeasurementsPopup = ({
  measurementsContainerRef,
  radiusRef,
  polygonRef,
  pointRef,
}) => {
  return (
    <>
      <MeasurementsContainer ref={measurementsContainerRef}>
        <strong>Most recently edited circle radius:</strong>
        <br />
        <Tooltip title="Copy Radius to Clipboard" placement="left-start">
          <Measurement ref={radiusRef} />
        </Tooltip>
        <strong>Total polygon area:</strong>
        <br />
        <Tooltip title="Copy Area to Clipboard" placement="left-start">
          <Measurement ref={polygonRef} />
        </Tooltip>
        <strong>Most recently edited point coordinates:</strong>
        <br />
        <Tooltip title="Copy Coordinates to Clipboard" placement="left-start">
          <Measurement ref={pointRef} />
        </Tooltip>
      </MeasurementsContainer>
    </>
  );
};

export default MeasurementsPopup;
