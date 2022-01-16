import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@material-ui/core";
// import SearchIcon from "@material-ui/icons/Search";
import MapIcon from "@material-ui/icons/Map";
import styled from "styled-components/macro";

/**
 * Utility function used to leverage the Mapbox static map API and return
 * a basemap preview for the specified style
 * @param {string} style Mapbox style name (i.e. streets)
 * @returns {string} returns an api endpoint for an image of the specified style
 */
const getBasemapImage = (style) => {
  return `https://api.mapbox.com/styles/v1/mapbox/${style}/static/-97.4644,31.056,12.69,0/180x100@2x/?attribution=false&logo=false&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`;
};

const Container = styled(Paper)`
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  position: absolute;
  right: 54px;
  top: 10px;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transition-duration: 300ms;
  width: ${(props) => (props.open ? "400px" : "40px")};
  z-index: 1;
`;

const ControlHeader = styled.div`
  align-items: center;
  background-color: #fafafa;
  border-bottom: ${(props) =>
    props.open ? "1px solid #dddddd" : "1px solid transparent"};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  height: 42px;
  position: fixed;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transition-duration: 300ms;
  width: ${(props) => (props.open ? "400px" : "40px")};
`;

const InnerContainer = styled.div`
  margin-top: ${(props) => (props.open ? "43px" : 0)};
  overflow-x: hidden;
  // change max-height from 500 to 535 to eliminate a scroll when all layers are shown
  max-height: 540px;
  min-height: 0px;
  overflow-y: auto;
  height: ${(props) => (props.open ? props.height : 0)}px;
  transition: height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transition-duration: 300ms;
  padding: ${({ theme }) => theme.spacing(2)}px;
`;

const BasemapItems = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)}px;
  flex-wrap: wrap;
`;

const BasemapItem = styled.div`
  width: calc(50% - 8px);
`;

const BasemapPreview = styled.div`
  background: url("${({ imageUrl }) => imageUrl}");
  background-size: cover;
  border: 1px solid #ddd;
  border-color: ${({ active, theme }) =>
    active ? theme.palette.primary.main : "#ddd"};
  border-radius: 4px;
  cursor: pointer;
  height: 100px;
  // width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const BasemapsControl = ({ items, onBasemapChange, value }) => {
  const [controlOpen, setControlOpen] = useState(false);
  const childRef = useRef(null);
  const [childHeight, setChildHeight] = useState(0);

  /**
   * This logic is used to properly animate the height changes
   * when a user shows/hides the layer control
   */
  useEffect(() => {
    const childHeight = controlOpen ? childRef?.current?.clientHeight + 24 : 0;
    setChildHeight(childHeight);
  }, [childRef, controlOpen]);

  return (
    <Container open={controlOpen}>
      <ControlHeader open={controlOpen}>
        <Box
          alignItems="center"
          display="flex"
          gridColumnGap={8}
          p={2}
          onClick={() => setControlOpen((s) => !s)}
        >
          <MapIcon />
          {controlOpen && <Typography variant="subtitle1">Basemaps</Typography>}
        </Box>
        {controlOpen && (
          <Box m={2}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setControlOpen((s) => !s)}
            >
              {controlOpen ? "Hide" : "Show"}
            </Button>
          </Box>
        )}
      </ControlHeader>

      <InnerContainer open={controlOpen} height={childHeight}>
        <BasemapItems ref={childRef}>
          {items?.map((item) => {
            return (
              <BasemapItem
                key={item.name}
                onClick={() => onBasemapChange(item)}
              >
                <Typography variant="body2" gutterBottom>
                  {item.name}
                </Typography>
                <BasemapPreview
                  active={item.style === value}
                  imageUrl={getBasemapImage(item.style)}
                />
              </BasemapItem>
            );
          })}
        </BasemapItems>
      </InnerContainer>
    </Container>
  );
};

export default BasemapsControl;
