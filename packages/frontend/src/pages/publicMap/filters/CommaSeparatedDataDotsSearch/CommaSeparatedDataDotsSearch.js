import React, { useEffect, useLayoutEffect, useState } from "react";
import { InputAdornment, TextField as MuiTextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components/macro";
import {
  DEFAULT_MAP_CENTER,
  WELLS_LABELS_LAYER_ID,
  WELLS_LAYER_ID,
} from "../../constants";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { lineColors } from "../../../../utils";

const TextField = styled(MuiTextField)`
  width: 100%;
`;

const CommaSeparatedDataDotsSearch = ({ map }) => {
  //current value in the search box
  const [value, setValue] = useState("");

  //an unique set of the submitted wells, all caps and stripped
  const [dataDots, setDataDots] = useState([""]);

  //upon load, zoom to the center of the clearwater markers
  //draw a rectangle that represents the area of markers
  //**a marker must be on the screen in order for it to be in the query results
  useEffect(() => {
    map?.flyTo({ center: DEFAULT_MAP_CENTER, zoom: 7 });
    const northEast = [-111.16265, 44.55016];
    const southEast = [-111.16265, 42.12127];
    const southWest = [-114.43207, 42.12127];
    const northWest = [-114.43207, 44.55016];

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
    if (
      map !== undefined &&
      map.getLayer(WELLS_LAYER_ID) &&
      map.getLayer(WELLS_LABELS_LAYER_ID) &&
      dataDots
    ) {
      map.setFilter(WELLS_LAYER_ID, [
        "match",
        ["get", "loc_id"],
        ...dataDots,
        true,
        false,
      ]);
      map.setFilter(WELLS_LABELS_LAYER_ID, [
        "match",
        ["get", "loc_id"],
        ...dataDots,
        true,
        false,
      ]);
    }
  }, [dataDots]); //eslint-disable-line

  //equiv of ComponentWillUnmount
  //when the component resolves, remove the filter and the bounding box
  useLayoutEffect(() => {
    return () => {
      map.setFilter(WELLS_LAYER_ID, null);
      map.setFilter(WELLS_LABELS_LAYER_ID, null);
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
      map?.flyTo({ center: DEFAULT_MAP_CENTER, zoom: 7 });
    }
  };

  //when the user submits, take the value string and turn it into an set
  //that removes duplicates, white space, and makes all letters cap
  //then query every point and compare to those within the wells set
  //take the resulting coordinates and zoom to a bounding box containing those points
  //setWells to the original set to apply the filter
  const handleSubmit = (event) => {
    event.preventDefault();
    const dataDotsArray = value.replaceAll(" ", "").toUpperCase().split(",");
    const uniqueDataDotsArray = [...new Set(dataDotsArray)];

    const allDataDots = map.querySourceFeatures("data-dots", {
      sourceLayer: "data-dots",
    });

    const filteredDataDots = allDataDots.filter((item) => {
      return uniqueDataDotsArray.includes(item.properties.loc_id);
    });

    const allCoords = filteredDataDots.map((item) => [
      item.properties.lon_dd,
      item.properties.lat_dd,
    ]);

    if (allCoords.length) {
      const bounds = allCoords.reduce(function (bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(allCoords[0], allCoords[0]));

      map.fitBounds(bounds, {
        padding: 200,
      });
    }

    setDataDots([uniqueDataDotsArray]);
  };

  return (
    <>
      <form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <TextField
          style={{ width: "100%", minWidth: "275px" }}
          id="comma-separated-data-dots-search"
          label="Multiple Data Dots Filter"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          autoComplete="off"
          onChange={handleChange}
          placeholder="Comma separated data dot ids"
          type="search"
          value={value}
          variant="outlined"
          size="small"
        />
      </form>
    </>
  );
};

export default CommaSeparatedDataDotsSearch;
