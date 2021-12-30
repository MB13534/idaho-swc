import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
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
  top: 10px;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transition-duration: 300ms;
  width: ${(props) => (props.open ? "300px" : "40px")};
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
  width: ${(props) => (props.open ? "300px" : "40px")};
`;

const LayersInnerContainer = styled.div`
  margin-top: 43px;
  overflow-y: auto;
  // change max-height from 500 to 535 to eliminate a scroll when all layers are shown
  max-height: 535px;
  min-height: 0px;
  overflow-y: auto;
  height: ${(props) => (props.open ? props.height : 0)}px;
  transition: height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transition-duration: 300ms;
`;

/**
 * Utility used to translate a Mapbox paint style
 * into an array of legend items
 * Currently only setup to support a basic fill color and
 * the 'match' flavor of Mapbox Expressions/data driven styling
 * Reference https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#match
 * @param {object} layer Mapbox layer representation
 * @returns
 */
const getLegendOptions = (layer) => {
  /**
   * Get the proper object property and color associated with the layer
   * based on the layer type
   */
  const colorProperty = `${layer?.type}-color`;
  const color = layer?.paint?.[colorProperty];

  /**
   * If it is just a standard color rule (i.e. no data driven styling), just
   * grab the color,
   * Otherwise, if we are using Mapbox expressions/data-driven styling we need
   * to parse the paint property and convert it into an array of legend
   * items
   */
  if (!Array.isArray(color)) {
    return [{ color, text: layer.name }];
  }

  const colorsExpression = [...color];

  // remove some unused parts of the expression
  colorsExpression.splice(0, 2);

  // grab the fallback value (i.e. what is used if a feature doesn't match any category)
  const fallbackValue = colorsExpression.splice(colorsExpression.length - 1, 1);

  /**
   * Loop through the mapbox expression and pull out the color and the
   * category it is associated with
   * The expression that is being parsed is in a format like
   * [["Industrial"], "#1f78b4", ["Ag/Irrigation"],"#b2df8a"]
   * so even odd indexes in the array represent categories and even number
   * indexes represent the associated color
   * As a result we have to loop through the expression and merge
   * two items into a single one
   */
  const legendOptions = colorsExpression
    .map((value, index) => {
      if (index < colorsExpression.length - 1 && index % 2 === 0) {
        return {
          color: colorsExpression[index + 1],
          text: Array.isArray(value) ? value?.join(", ") : value,
        };
      }
      return null;
    })
    .filter((d) => d !== null);

  // Add the fallback value to the end of array
  legendOptions.push({ color: fallbackValue, text: "N/A Value" });
  return legendOptions;
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

/**
 * TODOS
 * [] Add support for layers search
 */
const LayersControl = ({ items, onLayerChange }) => {
  const [controlOpen, setControlOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState(["Clearwater Wells"]);
  const childRef = useRef(null);
  const [childHeight, setChildHeight] = useState(0);

  /**
   * This logic is used to properly animate the height changes
   * when a user shows/hides the layer control
   */
  useEffect(() => {
    const childHeight = controlOpen ? childRef?.current?.clientHeight : 0;
    setChildHeight(childHeight);
  }, [childRef, controlOpen, expandedItems, items]);

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

  /**
   * Handler used to control the expanded/collapsed state of the
   * legend for a layer
   */
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
    <Container open={controlOpen}>
      <ControlHeader open={controlOpen}>
        <Box
          alignItems="center"
          display="flex"
          gridColumnGap={8}
          p={2}
          onClick={() => setControlOpen((s) => !s)}
        >
          <LayersIcon />
          {controlOpen && <Typography variant="subtitle1">Layers</Typography>}
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

      <LayersInnerContainer open={controlOpen} height={childHeight}>
        <Box display="flex" flexDirection="column" ref={childRef}>
          <List dense>
            {uniqueItems?.length === 0 && (
              <Box textAlign="center">
                <Typography variant="body1">No layers found</Typography>
              </Box>
            )}
            {uniqueItems?.map((item) => {
              const open = expandedItems.includes(item?.name);
              const layerVisible = item?.layout?.visibility === "visible";
              return (
                <Box key={item?.name}>
                  <ListItem onClick={() => handleVisibilityChange(item)}>
                    <Checkbox
                      edge="start"
                      checked={layerVisible}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": "test" }}
                    />
                    <ListItemText
                      primary={item?.name}
                      primaryTypographyProps={{
                        color: layerVisible ? "textPrimary" : "textSecondary",
                      }}
                    />
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
        </Box>
      </LayersInnerContainer>
    </Container>
  );
};

export default LayersControl;
