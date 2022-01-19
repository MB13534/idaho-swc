import React, { useEffect, useLayoutEffect, useState } from "react";
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { WELLS_LAYER_ID } from "../../constants";

const CommaSeparatedWellsSearch = ({ map }) => {
  const [value, setValue] = useState("");

  const [wells, setWells] = useState([""]);
  useEffect(() => {
    if (map !== undefined && map.getLayer(WELLS_LAYER_ID) && wells) {
      map.setFilter(WELLS_LAYER_ID, [
        "match",
        ["get", "cuwcd_well_number"],
        ...wells,
        true,
        false,
      ]);
    }
  }, [wells]); //eslint-disable-line

  //equiv of ComponentWillUnmount
  useLayoutEffect(() => {
    return () => {
      map.setFilter(WELLS_LAYER_ID, null);
    };
  }, []); //eslint-disable-line

  const handleChange = (event) => {
    setValue(event?.target?.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const wellsArray = value.replaceAll(" ", "").toUpperCase().split(",");
    const uniqueWellsArray = [...new Set(wellsArray)];
    setWells([uniqueWellsArray]);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          id="comma-separated-wells-search"
          label="Multiple Wells filter"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          // autoComplete="off"
          onChange={handleChange}
          placeholder="Filter by comma separated wells"
          style={{ width: 350 }}
          type="search"
          value={value}
          variant="outlined"
          size="small"
        />
      </form>
    </>
  );
};

export default CommaSeparatedWellsSearch;
