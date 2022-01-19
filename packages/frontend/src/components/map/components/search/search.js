import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import styled from "styled-components/macro";

const CustomSearch = styled(TextField)`
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  top: 10px;
  left: 50px;
  width: calc(100% - 100px);
  z-index: 1299;
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
    const wellsArray = value.replaceAll(" ", "").split(",");
    setWells([wellsArray]);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CustomSearch
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
