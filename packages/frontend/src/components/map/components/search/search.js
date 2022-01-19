import React, { useEffect, useState } from "react";
import { InputAdornment, TextField } from "@material-ui/core";
import styled from "styled-components/macro";
import SearchIcon from "@material-ui/icons/Search";

const CustomSearch = styled(TextField)`
  fieldset {
    border-radius: 15px;
  }
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  top: 10px;
  left: 50px;
  width: calc(100% - 100px);
  z-index: 1;
  &:hover {
    background-color: white;
  }
`;

const Search = ({ map, radioValue }) => {
  const [value, setValue] = useState("");

  const [wells, setWells] = useState([""]);

  useEffect(() => {
    if (map !== undefined && map.getLayer("locations") && wells) {
      if (wells[0] === "") {
        if (radioValue === "all") {
          map.setFilter("locations", null);
          map.setFilter("locations-labels", null);
        }
      } else {
        map.setFilter("locations", [
          "match",
          ["get", "cuwcd_well_number"],
          ...wells,
          true,
          false,
        ]);
        map.setFilter("locations-labels", [
          "match",
          ["get", "cuwcd_well_number"],
          ...wells,
          true,
          false,
        ]);
      }
    }
  }, [wells]); //eslint-disable-line

  const handleChange = (event) => {
    setValue(event?.target?.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const wellsArray = value.replaceAll(" ", "").toUpperCase().split(",");
    setWells([wellsArray]);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CustomSearch
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          id="outlined-basic"
          autoComplete="off"
          onChange={handleChange}
          placeholder="Filter by comma separated wells"
          style={{ width: "calc(100% - 100px)" }}
          type="search"
          value={value}
          variant="outlined"
          size="small"
        />
      </form>
    </>
  );
};

export default Search;
