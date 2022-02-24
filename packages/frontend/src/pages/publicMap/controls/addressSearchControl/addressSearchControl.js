import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ClickAwayListener,
  Divider,
  InputAdornment,
  List,
  ListItem,
  Paper,
  Popper,
  TextField,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components/macro";
import mbxClient from "@mapbox/mapbox-sdk";
import mbxGeocoder from "@mapbox/mapbox-sdk/services/geocoding.js";
import Loader from "../../../../components/Loader";
import useDebounce from "../../../../hooks/useDebounce";
import { DEFAULT_MAP_CENTER } from "../../constants";

const baseClient = mbxClient({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
});
const geocodingClient = mbxGeocoder(baseClient);

const Container = styled(Paper)`
  background: #fff;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  left: 359px;
  position: absolute;
  top: 10px;
  overflow-x: hidden;
  overflow-y: hidden;
  width: 300px;
  z-index: 1;
`;

/**
 * Component used to render the results for the address search
 */
const SearchResults = ({
  anchorEl,
  loading,
  open,
  onClose,
  onSelect,
  searchResults,
}) => {
  const handleSelect = (coordinates) => () => {
    onSelect(coordinates);
    onClose();
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      style={{ zIndex: 4 }}
      transition
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper style={{ width: 300, overflowY: "auto" }}>
          {loading ? (
            <Loader />
          ) : (
            <List dense component="nav" aria-label="main mailbox folders">
              {searchResults?.slice(0, 49)?.map((result) => (
                <React.Fragment key={result?.label}>
                  <ListItem button onClick={handleSelect(result?.coordinates)}>
                    <Typography variant="body1">{result?.label}</Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

/**
 * Component used to render a control that allows the user
 * to search for an address and then zoom to it by selecting it
 */
const AddressSearchControl = ({ onSelect }) => {
  const searchRef = useRef(null);
  const [value, setValue] = useState("");
  const debouncedSearchValue = useDebounce(value, 200);
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!searchResults?.length);
  }, [searchResults]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setValue(event?.target?.value);
  };

  /**
   * Function used to fetch a list addresses that most closely
   * match the user's search value
   */
  const fetchAddresses = useCallback(async () => {
    if (debouncedSearchValue) {
      setSearchResultsLoading(true);
      const { body } = await geocodingClient
        .forwardGeocode({
          bbox: [-100.456033, 29.175105, -94.49122577418242, 33.50022543589624],
          countries: ["US"],
          query: debouncedSearchValue,
          limit: 5,
          proximity: DEFAULT_MAP_CENTER,
        })
        .send();
      const mappedResults = body?.features.map((feat) => ({
        label: feat.place_name,
        coordinates: feat.geometry.coordinates,
      }));
      setSearchResultsLoading(false);
      setSearchResults(mappedResults);
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return (
    <Container>
      <TextField
        id="address-search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={handleChange}
        onFocus={() => !!value && setOpen(true)}
        placeholder="Search by address"
        ref={searchRef}
        style={{ width: "100%" }}
        type="search"
        value={value}
        variant="outlined"
        size="small"
      />
      <SearchResults
        anchorEl={searchRef?.current}
        loading={searchResultsLoading}
        onClose={handleClose}
        onSelect={onSelect}
        open={open}
        searchResults={searchResults}
      />
    </Container>
  );
};

export default AddressSearchControl;
