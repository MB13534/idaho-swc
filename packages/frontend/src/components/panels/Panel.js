import React from "react";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
} from "@material-ui/core";

import styled from "styled-components/macro";

const Card = styled(MuiCard)`
  height: 100%;
`;

const CardContent = styled(MuiCardContent)`
  height: 100%;
`;

const ChartWrapper = styled.div`
  height: ${({ height }) => height};
  min-height: ${({ minHeight }) => minHeight};
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)}px);
  overflow-y: ${(props) => props.overflowY};
  overflow-x: ${(props) => props.overflowX};
`;

function Panel({
  children,
  title = null,
  rightHeader,
  height = "100%",
  minHeight = "0px",
  overflowY = "visible",
  overflowX = "visible",
}) {
  return (
    <Card>
      {title && <CardHeader action={rightHeader} title={title} />}
      <CardContent>
        <ChartWrapper
          overflowY={overflowY}
          overflowX={overflowX}
          height={height}
          minHeight={minHeight}
        >
          {children}
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}

export default Panel;
