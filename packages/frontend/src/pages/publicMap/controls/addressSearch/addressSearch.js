import React, { useEffect, useRef, useState } from "react";
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
import useDebounce from "../../../../hooks/useDebounce";

const baseClient = mbxClient({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
});
const geocodingClient = mbxGeocoder(baseClient);

const Container = styled(Paper)`
  background: #fff;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  left: 49px;
  position: absolute;
  top: 10px;
  // max-height: calc(100% - 32px);
  overflow-x: hidden;
  overflow-y: hidden;
  width: 300px;
  z-index: 1;
`;

const SearchResults = ({
  anchorEl,
  open,
  onClose,
  onSelect,
  searchResults,
}) => {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      style={{ zIndex: 2 }}
      transition
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper style={{ width: 400, height: 400, overflowY: "auto" }}>
          <List dense component="nav" aria-label="main mailbox folders">
            {searchResults?.slice(0, 49)?.map((result) => (
              <React.Fragment key={result?.item?.label}>
                <ListItem
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                  button
                  onClick={() => {
                    onSelect(result?.coordinates);
                    onClose();
                  }}
                >
                  {/* <Typography variant="caption">CUWCD Well Number</Typography> */}
                  <Typography variant="subtitle1">{result?.label}</Typography>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

const AddressSearch = ({ onSelect }) => {
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

  useEffect(() => {
    async function fetchResults(search) {
      if (search) {
        setSearchResultsLoading(true);
        const { body } = await geocodingClient
          .forwardGeocode({
            query: search,
            limit: 10,
          })
          .send();
        const mappedResults = body?.features.map((feat) => ({
          value: feat.place_name,
          label: feat.place_name,
          coordinates: feat.geometry.coordinates,
        }));
        setSearchResultsLoading(false);
        setSearchResults(mappedResults);
      }
    }
    fetchResults(debouncedSearchValue);
  }, [debouncedSearchValue]);

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
        size="medium"
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

export default AddressSearch;
