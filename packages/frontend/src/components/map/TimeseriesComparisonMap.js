import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import styled, { ThemeProvider } from "styled-components/macro";
import { useQuery } from "react-query";
import ResetZoomControl from "./ResetZoomControl";
import { STARTING_LOCATION } from "../../constants";
import ToggleBasemapControl from "./ToggleBasemapControl";
import debounce from "lodash.debounce";
import { lineColors } from "../../utils";
import ReactDOM from "react-dom";
import { jssPreset, StylesProvider } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles";
import createTheme from "../../theme";
import Popup from "../../pages/publicMap/popup";
import { create } from "jss";
import { useSelector } from "react-redux";
import axios from "axios";

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const TimeseriesComparisonMap = ({
  selectedHuc8Locations,
  selectedLeftLocations,
  selectedRightLocations,
}) => {
  const theme = useSelector((state) => state.themeReducer);
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const [map, setMap] = useState();

  const popUpRef = useRef(
    new mapboxgl.Popup({
      maxWidth: "400px",
      offset: 15,
      focusAfterOpen: false,
    })
  );
  const mapContainer = useRef(null); // create a reference to the map container

  const DUMMY_BASEMAP_LAYERS = [
    { url: "streets-v11", icon: "commute" },
    { url: "outdoors-v11", icon: "park" },
    { url: "satellite-streets-v11", icon: "satellite_alt" },
  ];

  const locationsLayer = {
    id: "locations",
    type: "circle",
    source: "locations",
    paint: {
      "circle-stroke-width": [
        "case",
        ["in", ["get", "index"], ["literal", selectedLeftLocations]],
        5,
        ["in", ["get", "index"], ["literal", selectedRightLocations]],
        5,
        1,
      ],
      "circle-stroke-color": [
        "case",
        ["in", ["get", "index"], ["literal", selectedLeftLocations]],
        lineColors.yellow,
        ["in", ["get", "index"], ["literal", selectedRightLocations]],
        lineColors.red,
        "black",
      ],
      "circle-radius": 7,
      "circle-color": [
        "case",
        ["==", ["get", "huc8"], "American Falls"],
        "#1F77B4",
        ["==", ["get", "huc8"], "Beaver-Camas"],
        "#AEC7E8",
        ["==", ["get", "huc8"], "Big Lost"],
        "#FF7F0E",
        ["==", ["get", "huc8"], "Blackfoot"],
        "#FFBB78",
        ["==", ["get", "huc8"], "Idaho Falls"],
        "#2CA02C",
        ["==", ["get", "huc8"], "Lake Walcott"],
        "#98DF8A",
        ["==", ["get", "huc8"], "Little Lost"],
        "#D62728",
        ["==", ["get", "huc8"], "Little Wood"],
        "#FF9896",
        ["==", ["get", "huc8"], "Lower Henrys"],
        "#9467BD",
        ["==", ["get", "huc8"], "Portneuf"],
        "#C5B0D5",
        ["==", ["get", "huc8"], "Raft"],
        "#8C564B",
        ["==", ["get", "huc8"], "Teton"],
        "#C49C94",
        ["==", ["get", "huc8"], "Upper Henrys"],
        "#E377C2",
        ["==", ["get", "huc8"], "Upper Snake-Rock"],
        "#F7B6D2",
        ["==", ["get", "huc8"], "Willow"],
        "#7F7F7F",
        lineColors.black,
      ],
    },
    lreProperties: {
      popup: {
        titleField: "description",
        excludeFields: ["index", "description"],
      },
    },
  };

  const huc8Fill = {
    id: "huc-8-boundaries-fill",
    name: "HUC 8 Boundaries",
    type: "fill",
    source: "huc-8-boundaries",
    "source-layer": "WBDHU08_UpperSnake-6vc1aa",
    paint: {
      "fill-color": "#60BAF0",
      "fill-opacity": 0,
    },
    lreProperties: {
      layerGroup: "huc-8-boundaries",
    },
    drawOrder: 99,
  };

  const huc8Line = {
    id: "huc-8-boundaries-line",
    name: "HUC 8 Boundaries",
    type: "line",
    source: "huc-8-boundaries",
    "source-layer": "WBDHU08_UpperSnake-6vc1aa",
    paint: {
      "line-color": "#60BAF0",
      "line-width": 2,
    },
    lreProperties: {
      layerGroup: "huc-8-boundaries",
    },
    drawOrder: 99,
  };

  const { data, isLoading, error } = useQuery(
    ["summary-of-sites-tscompare"],
    async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/summary-of-sites-tscompare`
        );

        return data.filter((location) => location.location_geometry);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/" + DUMMY_BASEMAP_LAYERS[0].url,
      center: STARTING_LOCATION,
      zoom: 6,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      }),
      "top-left"
    );
    map.addControl(new mapboxgl.FullscreenControl());
    // Add locate control to the map.
    map.addControl(new ResetZoomControl(), "top-left");

    DUMMY_BASEMAP_LAYERS.forEach((layer) => {
      return map.addControl(new ToggleBasemapControl(layer.url, layer.icon));
    });

    map.on("load", () => {
      setMapIsLoaded(true);
      setMap(map);
    });
  }, []); // eslint-disable-line

  //resizes map when mapContainerRef dimensions changes (sidebar toggle)
  useEffect(() => {
    if (map) {
      const resizer = new ResizeObserver(debounce(() => map.resize(), 100));
      resizer.observe(mapContainer.current);
      return () => {
        resizer.disconnect();
      };
    }
  }, [map]);

  useEffect(() => {
    if (mapIsLoaded && data?.length > 0 && typeof map != "undefined") {
      if (!map.getSource("locations")) {
        map.addSource("huc-8-boundaries", {
          type: "vector",
          url: "mapbox://idahoswc.1rdlvyx6",
        });

        map.addLayer(huc8Fill);
        map.addLayer(huc8Line);

        map.addSource("locations", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: data.map((location) => {
              return {
                id: location.loc_ndx,
                type: "Feature",
                properties: {
                  description: location.loc_name,
                  index: location.loc_ndx,
                  locType: location.loc_type_name,
                  parameters: location.parameter_name_array.join(", "),
                  huc8: location.huc8_name,
                  huc10: location.huc10_name,
                },
                geometry: {
                  type: location.location_geometry.type,
                  coordinates: location.location_geometry.coordinates,
                },
              };
            }),
          },
        });
        // Add a layer showing the places.
        map.addLayer(locationsLayer);

        map.on("click", "huc-8-boundaries-fill", (e) => {
          const feature = map
            .queryRenderedFeatures(e.point)
            .filter((feature) => feature?.properties?.Name)[0];

          const description = feature.properties.Name;

          const huc8Popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map);

          map.on("closeAllPopups", () => {
            huc8Popup.remove();
          });
        });

        map.on("click", "locations", (e) => {
          map.fire("closeAllPopups");

          const features = map.queryRenderedFeatures(e.point);
          const myFeatures = features.filter(
            (feature) => feature.source === "locations"
          );
          const coordinates = [e.lngLat.lng, e.lngLat.lat];

          const popupNode = document.createElement("div");
          ReactDOM.render(
            //MJB adding style providers to the popup
            <StylesProvider jss={jss}>
              <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
                <ThemeProvider theme={createTheme(theme.currentTheme)}>
                  <Popup
                    layers={[locationsLayer]}
                    features={myFeatures}
                    height="100%"
                    width="252px"
                    size="small"
                  />
                </ThemeProvider>
              </MuiThemeProvider>
            </StylesProvider>,
            popupNode
          );
          popUpRef.current
            .setLngLat(coordinates)
            .setDOMContent(popupNode)
            .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on("mouseenter", "locations", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        // Change it back to a pointer when it leaves.
        map.on("mouseleave", "locations", () => {
          map.getCanvas().style.cursor = "";
        });
      }
    }
  }, [isLoading, mapIsLoaded, map, data]); //eslint-disable-line

  //filters the table based on the selected radioValues filters
  useEffect(() => {
    if (map !== undefined && map.getLayer("locations")) {
      map.setFilter("locations", [
        "in",
        ["get", "index"],
        ["literal", selectedHuc8Locations],
      ]);
    }
  }, [selectedHuc8Locations]); // eslint-disable-line

  useEffect(() => {
    if (map !== undefined && map.getLayer("locations")) {
      map.setPaintProperty("locations", "circle-stroke-width", [
        "case",
        ["in", ["get", "index"], ["literal", selectedLeftLocations]],
        5,
        ["in", ["get", "index"], ["literal", selectedRightLocations]],
        5,
        1,
      ]);
      map.setPaintProperty("locations", "circle-stroke-color", [
        "case",
        ["in", ["get", "index"], ["literal", selectedLeftLocations]],
        lineColors.yellow,
        ["in", ["get", "index"], ["literal", selectedRightLocations]],
        lineColors.red,
        "black",
      ]);
    }
  }, [selectedLeftLocations, selectedRightLocations]); //eslint-disable-line

  if (error) return "An error has occurred: " + error.message;

  return (
    <Root>
      <MapContainer ref={mapContainer} />
    </Root>
  );
};

export default TimeseriesComparisonMap;
