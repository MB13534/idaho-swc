import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Box,
  Paper,
  Typography,
} from "@material-ui/core";
import LayersIcon from "@material-ui/icons/Layers";
import MapIcon from "@material-ui/icons/Map";
import ExpandMore from "@material-ui/icons/ExpandMore";
import styled from "styled-components/macro";
import LayersControl from "../layersControl";
import BasemapsControl from "../basemapsControl";

const Container = styled(Paper)`
  background: none;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  left: 49px;
  position: absolute;
  top: 80px;
  // max-height: calc(100% - 32px);
  overflow-x: hidden;
  overflow-y: hidden;
  width: 300px;
  z-index: 1;
`;

const AccordionDetails = styled(MuiAccordionDetails)`
  background-color: #fafafa;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  max-height: 450px;
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
`;

const MainControl = ({
  activeBasemap,
  basemaps,
  layers,
  onBasemapChange,
  onLayerChange,
  value,
}) => {
  const [expandedItem, setExpandedItem] = useState("layers");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedItem(isExpanded ? panel : false);
  };

  return (
    <Container>
      {value === "attributes_search" && (
        <Accordion
          expanded={expandedItem === "basemaps"}
          onChange={handleChange("basemaps")}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box alignItems="center" display="flex" gridColumnGap={8}>
              <MapIcon />
              <Typography variant="subtitle1">Basemaps</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <BasemapsControl
              items={basemaps}
              value={activeBasemap}
              onBasemapChange={onBasemapChange}
            />
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion
        expanded={expandedItem === "layers"}
        onChange={handleChange("layers")}
      >
        <AccordionSummary
          aria-controls="layers-content"
          id="layers-header"
          expandIcon={<ExpandMore />}
        >
          <Box alignItems="center" display="flex" gridColumnGap={8}>
            <LayersIcon />
            <Typography variant="subtitle1">Layers</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <LayersControl items={layers} onLayerChange={onLayerChange} />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default MainControl;
