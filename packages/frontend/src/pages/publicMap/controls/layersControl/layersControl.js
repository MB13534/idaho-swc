import React, { useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from "@material-ui/core";
// import SearchIcon from "@material-ui/icons/Search";

import ExpandMore from "@material-ui/icons/ExpandMore";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { titleize } from "inflected";

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
  <Box
    bgcolor={color}
    borderRadius="50%"
    height={12}
    width={12}
    style={{ minWidth: "12px" }}
  />
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
            {titleize(text)}
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
  const [expandedItems, setExpandedItems] = useState([
    "Data Dots",
    "Data Dots Labels",
  ]);

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
    <Box style={{ width: "100%" }} display="flex" flexDirection="column">
      <List dense>
        {uniqueItems?.length === 0 && (
          <Box textAlign="center">
            <Typography variant="body1">No layers found</Typography>
          </Box>
        )}
        {uniqueItems
          ?.sort((a, b) =>
            (a.legendOrder || 0) > (b.legendOrder || 0) ? -1 : 1
          )
          .map((item) => {
            const open = expandedItems.includes(item?.name);
            const layerVisible = item?.layout?.visibility === "visible";
            return (
              <Box key={item?.name} id="layerCheck">
                <ListItem
                  // style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleVisibilityChange(item);
                    (!layerVisible && !open && handleExpandItem(item?.name)) ||
                      (layerVisible && open && handleExpandItem(item?.name));
                  }}
                >
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
  );
};

export default LayersControl;
