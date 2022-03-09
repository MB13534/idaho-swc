import React, { forwardRef } from "react";

import { Typography, Divider, Box, Grid as MuiGrid } from "@material-ui/core";

import moment from "moment";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";

const Grid = styled(MuiGrid)(spacing);

const PrintMapFormat = forwardRef(({ title, mapImg, map }, ref) => {
  const Centered = ({ children }) => {
    return <div style={{ textAlign: "center" }}>{children}</div>;
  };
  const scale = document.querySelector(".mapboxgl-ctrl-scale").cloneNode(true);
  // scale.style.width = scale.style.width * 1000 / map.getCanvas().width
  let strWidth = scale.style.width;
  strWidth = +strWidth.substring(0, strWidth.length - 2);
  strWidth = (strWidth * 1000) / map.getCanvas().width;
  scale.style.width = `${strWidth}px`;

  const legend = Array.from(document.querySelectorAll(".Mui-checked"))
    .map((item) => item.parentElement.parentElement.nextElementSibling)
    .filter((item) => item);

  return (
    <Box style={{ padding: "32px" }} ref={ref}>
      <Centered>
        <Grid container justify={"space-between"} alignItems={"center"}>
          <Grid item xs={3} style={{ textAlign: "left" }}>
            <img
              src="/static/img/idaho-swc-logo-full.png"
              width="200px"
              alt={"Idaho Surface Water Coalition"}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">Idaho SWC Map</Typography>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="subtitle2">
              Created: {moment().format("MMMM Do YYYY, h:mma")}
            </Typography>
          </Grid>
          <Grid item xs={3} style={{ textAlign: "right" }} />
        </Grid>
      </Centered>
      <Divider style={{ marginBottom: "8px" }} />
      <Centered>
        <div style={{ maxHeight: "500px", overflow: "hidden" }}>
          <img
            src={mapImg}
            style={{
              width: "1000px",
              height: "auto",
            }}
            alt="Map"
          />
        </div>
      </Centered>
      <Grid
        container
        mt={4}
        justify={"space-between"}
        alignItems={"flex-start"}
      >
        <Grid item xs={7} style={{ textAlign: "left" }}>
          <Grid container>
            {legend.map((item, index) => (
              <Grid item xs={6} key={index}>
                <span dangerouslySetInnerHTML={{ __html: item.outerHTML }} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <span dangerouslySetInnerHTML={{ __html: scale.outerHTML }} />
        </Grid>
        <Grid item xs={2} style={{ textAlign: "right" }}>
          <div style={{ textAlign: "right" }}>
            <img
              src="/static/img/lrewater-logo-full.png"
              width="75px"
              alt={"LRE Water"}
            />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
});

export default PrintMapFormat;
