import { Box, Typography } from "@material-ui/core";
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

  &:hover {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const BasemapsControl = ({ items, onBasemapChange, value }) => {
  return (
    <Box p={1} mb={2}>
      <BasemapItems>
        {items?.map((item) => {
          return (
            <BasemapItem key={item.name} onClick={() => onBasemapChange(item)}>
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
    </Box>
  );
};

export default BasemapsControl;
