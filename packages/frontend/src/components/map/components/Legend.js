import React from "react";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components/macro";

const Root = styled.div`
  background-color: rgba(49, 49, 49, 0.75);
  border-radius: 4px;
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 50px;
  padding: 15px;
  padding-top: 0;
  padding-bottom: 0;
  max0width: 300px;
`;

const LegendSubtitle = styled(Typography)`
  color: white;
`;

const LegendListItem = styled.div`
  margin-top: 5px;
  display: flex;
  color: white;
  align-items: center;
`;

const LegendSymbolPoint = styled.div`
  border: 1.5px solid #333333;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: ${({ color }) => color};
`;

const LegendText = styled.div`
  margin-left: 5px;
  font-size: 0.8rem;
`;

const LegendList = styled.div`
  margin-bottom: 15px;
`;

const Legend = ({ legendColors }) => {
  return (
    <Root id="map-legend">
      <Typography variant="h3" color="primary">
        Legend
      </Typography>
      <LegendSubtitle variant="caption">Percent of Median Peak</LegendSubtitle>
      <LegendList>
        {legendColors.map((data) => (
          <LegendListItem key={data.name}>
            <LegendSymbolPoint color={data.color} />
            <LegendText>{data.name}</LegendText>
          </LegendListItem>
        ))}
      </LegendList>
    </Root>
  );
};

export default Legend;
