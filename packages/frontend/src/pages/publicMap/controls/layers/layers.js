import {
  Box,
  Checkbox,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import LayersIcon from "@material-ui/icons/Layers";

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
      <Box p={2}>
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
      </Box>
      <List dense>
        {items?.length === 0 && (
          <Box textAlign="center">
            <Typography variant="body1">No layers found</Typography>
          </Box>
        )}
        {items?.map((item) => (
          <ListItem
            key={item?.name}
            onClick={() =>
              onLayerChange({
                id: item?.id,
                visible: item?.layout?.visibility === "none",
              })
            }
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
