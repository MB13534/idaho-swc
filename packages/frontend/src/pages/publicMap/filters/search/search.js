import React, { useEffect, useMemo, useRef, useState } from "react";
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
import Fuse from "fuse.js";
import axios from "axios";
import { useQuery } from "react-query";
import useDebounce from "../../../../hooks/useDebounce";

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
        <Paper style={{ width: 350, height: 384, overflowY: "auto" }}>
          <List dense component="nav" aria-label="main mailbox folders">
            {searchResults?.slice(0, 49)?.map((result) => (
              <React.Fragment key={result?.item?.well_ndx}>
                <ListItem
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                  button
                  onClick={() => onSelect(result?.item)}
                >
                  {/* <Typography variant="caption">CUWCD Well Number</Typography> */}
                  <Typography variant="subtitle1">
                    {result?.item?.cuwcd_well_number}
                  </Typography>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <Typography variant="caption">
                        State Well Number
                      </Typography>
                      <Typography variant="body1">
                        {result?.item?.state_well_number || "N/A"}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption">Well Owner</Typography>
                      <Typography variant="body1">
                        {result?.item?.well_owner || "N/A"}
                      </Typography>
                    </div>
                  </div>
                  {/* <ListItemText primary={result?.item?.cuwcd_well_number} /> */}
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

const Search = ({ onSelect }) => {
  const searchRef = useRef(null);
  const { data: options } = useQuery(["Search Options"], async () => {
    try {
      return await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/api/public-map/wells`
      );
    } catch (err) {
      console.error(err);
    }
  });
  const [value, setValue] = useState("");
  const debouncedSearchValue = useDebounce(value, 200);
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!searchResults?.length);
  }, [searchResults]);

  const fuzzySearcher = useMemo(() => {
    if (options?.data) {
      return new Fuse(options?.data, {
        ignoreLocation: true,
        keys: [
          "cuwcd_well_number",
          "state_well_number",
          "well_owner",
          "aggregate_system",
        ],
      });
    }
  }, [options]);

  const handleClose = (event) => {
    if (searchRef.current && searchRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleChange = (event) => {
    setValue(event?.target?.value);
  };

  useEffect(() => {
    const results = fuzzySearcher && fuzzySearcher.search(debouncedSearchValue);
    setSearchResults(results);
  }, [debouncedSearchValue, fuzzySearcher]);

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Individual Well Search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={handleChange}
        onFocus={() => !!value && setOpen(true)}
        placeholder="Search by well attributes"
        ref={searchRef}
        style={{ width: "100%", minWidth: "162px" }}
        type="search"
        value={value}
        variant="outlined"
        size="small"
      />
      <SearchResults
        anchorEl={searchRef?.current}
        onClose={handleClose}
        onSelect={onSelect}
        open={open}
        searchResults={searchResults}
      />
    </>
  );
};

export default Search;
