import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
// import SearchIcon from "@material-ui/icons/Search";
import LayersIcon from "@material-ui/icons/Layers";
import { useMemo } from "react";

const Container = styled(Paper)(({ theme }) => ({
  boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
  left: 15,
  maxHeight: 400,
  position: "absolute",
  top: 15,
  width: 400,
  zIndex: 1,
}));

const LayersControl = ({ items, onLayerChange }) => {
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

  return (
    <Container>
      <Box
        alignItems="center"
        bgcolor="#fafafa"
        borderBottom="1px solid #dddddd"
        display="flex"
        gridColumnGap={8}
        p={2}
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
      <List dense>
        {uniqueItems?.length === 0 && (
          <Box textAlign="center">
            <Typography variant="body1">No layers found</Typography>
          </Box>
        )}
        {uniqueItems?.map((item) => (
          <ListItem
            key={item?.name}
            onClick={() => handleVisibilityChange(item)}
          >
            <Checkbox
              edge="start"
              checked={item?.layout?.visibility === "visible"}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": "test" }}
            />
            <ListItemText primary={item?.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default LayersControl;
