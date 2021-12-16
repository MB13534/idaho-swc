import { useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
} from "@material-ui/core";
// import SearchIcon from "@material-ui/icons/Search";
import LayersIcon from "@material-ui/icons/Layers";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ChevronRight from "@material-ui/icons/ChevronRight";
import styled from "styled-components/macro";

const Container = styled(Paper)`
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  left: 15px;
  position: absolute;
  top: 15px;
  width: 400px;
  z-index: 1;
`;

const LayersInnerContainer = styled.div`
  margin-top: 43px;
  overflow-y: auto;
  max-height: 500px;
`;

const getLegendOptions = (item) => {
  const colorProperty = `${item?.type}-color`;
  const color = item?.paint?.[colorProperty];
  if (!Array.isArray(color)) {
    return [{ color, text: item.name }];
  }
  const newColor = [...color];
  newColor.splice(0, 2);
  newColor.splice(newColor.length - 1, 1);
  const remappedColors = newColor
    .map((value, index) => {
      if (index < newColor.length - 1 && index % 2 === 0) {
        return {
          color: newColor[index + 1],
          text: Array.isArray(value) ? value?.join(", ") : value,
        };
      }
      return null;
    })
    .filter((d) => d !== null);
  return remappedColors;
};

const LegendSymbol = ({ color }) => (
  <Box bgcolor={color} borderRadius="50%" height={12} width={12} />
);

const LayerLegendIcon = ({ open }) =>
  open ? <ExpandMore /> : <ChevronRight />;

const LayerLegend = ({ item, open }) => {
  if (!open) return null;
  const legendItems = getLegendOptions(item);
  return (
    <Box display="flex" flexDirection="column" gridRowGap={4} mb={2} mx={11}>
      {legendItems.map(({ color, text }) => (
        <Box key={text} display="flex" alignItems="center" gridColumnGap={8}>
          <LegendSymbol color={color} />
          <Typography color="textSecondary" variant="body2">
            {text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const LayersControl = ({ items, onLayerChange }) => {
  const [expandedItems, setExpandedItems] = useState(["Clearwater Wells"]);

  /**
   * Generate a unique list of items to display in the layer
   * controls list
   * This approach allows us to represent grouped layers with a single
   * item in the list while still controlling the visibility values for
   * all of the associated grouped layers
   */
  const uniqueItems = useMemo(() => {
    const uniqueItemIds = [
      ...new Set(
        items.map((item) => {
          return item?.lreProperties?.layerGroup || item.id;
        })
      ),
    ];

    return uniqueItemIds.reduce((acc, curr) => {
      const match = items.find((item) => {
        const id = item?.lreProperties?.layerGroup || item.id;
        return id === curr;
      });
      acc.push(match);
      return acc;
    }, []);
  }, [items]);

  /**
   * Handler that controls the visibility of each layer group
   */
  const handleVisibilityChange = (item) => {
    const itemId = item?.lreProperties?.layerGroup || item.id;
    onLayerChange({
      id: itemId,
      visible: item?.layout?.visibility === "none",
    });
  };

  const handleExpandItem = (value) => {
    setExpandedItems((prevState) => {
      const newValues = [...prevState];
      const existingIndex = newValues.indexOf(value);
      if (existingIndex > -1) {
        newValues.splice(existingIndex, 1);
      } else {
        newValues.push(value);
      }
      return newValues;
    });
  };

  return (
    <Container>
      <Box
        alignItems="center"
        bgcolor="#fafafa"
        borderBottom="1px solid #dddddd"
        display="flex"
        gridColumnGap={8}
        p={2}
        position="fixed"
        width={400}
      >
        <LayersIcon />
        <Typography variant="subtitle1">Layers</Typography>
      </Box>
      {/* <Box p={2}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          label="Layers Search"
          margin="dense"
          placeholder="Search"
          variant="outlined"
          fullWidth
        />
      </Box> */}
      <LayersInnerContainer>
        <List dense>
          {uniqueItems?.length === 0 && (
            <Box textAlign="center">
              <Typography variant="body1">No layers found</Typography>
            </Box>
          )}
          {uniqueItems?.map((item) => {
            const open = expandedItems.includes(item?.name);
            return (
              <Box key={item?.name}>
                <ListItem onClick={() => handleVisibilityChange(item)}>
                  <Checkbox
                    edge="start"
                    checked={item?.layout?.visibility === "visible"}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": "test" }}
                  />
                  <ListItemText primary={item?.name} />
                  <ListItemSecondaryAction
                    onClick={() => handleExpandItem(item?.name)}
                  >
                    <IconButton edge="end" aria-label="delete">
                      <LayerLegendIcon open={open} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <LayerLegend open={open} item={item} />
              </Box>
            );
          })}
        </List>
      </LayersInnerContainer>
    </Container>
  );
};

export default LayersControl;
