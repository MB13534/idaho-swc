import React, { useEffect, useLayoutEffect, useState } from "react";
import { InputAdornment, TextField as MuiTextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components/macro";
import { WELLS_LAYER_ID } from "../../constants";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { lineColors } from "../../../../utils";

const TextField = styled(MuiTextField)`
  width: 100%;
`;

const CommaSeparatedWellsSearch = ({ map }) => {
  //current value in the search box
  const [value, setValue] = useState("");

  //an unique set of the submitted wells, all caps and stripped
  const [wells, setWells] = useState([""]);

  //upon load, zoom to the center of the clearwater markers
  //draw a rectangle that represents the area of markers
  //**a marker must be on the screen in order for it to be in the query results
  useEffect(() => {
    map?.flyTo({ center: [-97.99366949028948, 30.979780201064344], zoom: 8 });
    var northEast = [-97.08729741997672, 31.447227501139395];
    var southEast = [-97.08729741997672, 30.518054701366808];
    var southWest = [-98.93184683603334, 30.518054701366808];
    var northWest = [-98.93184683603334, 31.447227501139395];

    if (!map.getSource("boundingBox")) {
      map.addSource("boundingBox", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              northEast,
              southEast,
              southWest,
              northWest,
              northEast,
            ],
          },
        },
      });
      map.addLayer({
        id: "boundingBox",
        type: "line",
        source: "boundingBox",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": lineColors.maroon,
          "line-width": 5,
        },
      });
    }
  }, [map]);

  //when the user submits, the wells array gets created
  //when the wells array changes, the filter gets applied
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
  //when the component resolves, remove the filter and the bounding box
  useLayoutEffect(() => {
    return () => {
      map.setFilter(WELLS_LAYER_ID, null);
      map.removeLayer("boundingBox");
      map.removeSource("boundingBox");
    };
  }, []); //eslint-disable-line

  //when the user types, update the current value state
  //if the user clears the search box, reset the bounding box to influence
  //the user always includes the whole box in their search
  const handleChange = (event) => {
    setValue(event?.target?.value);
    if (event?.target?.value === "") {
      map?.flyTo({ center: [-97.99366949028948, 30.979780201064344], zoom: 8 });
    }
  };

  //when the user submits, take the value string and turn it into an set
  //that removes duplicates, white space, and makes all letters cap
  //then query every point and compare to those within the wells set
  //take the resulting coordinates and zoom to a bounding box containing those points
  //setWells to the original set to apply the filter
  const handleSubmit = (event) => {
    event.preventDefault();
    const wellsArray = value.replaceAll(" ", "").toUpperCase().split(",");
    const uniqueWellsArray = [...new Set(wellsArray)];

    const allWells = map.querySourceFeatures("clearwater-wells", {
      sourceLayer: "clearwater",
    });

    const filteredWells = allWells.filter((well) => {
      return uniqueWellsArray.includes(well.properties.cuwcd_well_number);
    });

    const allCoords = filteredWells.map((item) => [
      item.properties.longitude_dd,
      item.properties.latitude_dd,
    ]);

    if (allCoords.length) {
      var bounds = allCoords.reduce(function (bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(allCoords[0], allCoords[0]));

      map.fitBounds(bounds, {
        padding: 200,
      });
    }

    setWells([uniqueWellsArray]);
  };

  return (
    <>
      <form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="comma-separated-wells-search"
          label="Multiple Wells Filter"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          autoComplete="off"
          onChange={handleChange}
          placeholder="Filter by comma separated wells"
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
