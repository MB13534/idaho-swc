import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles";
import styled, { ThemeProvider } from "styled-components/macro";
import { jssPreset, StylesProvider } from "@material-ui/core/styles";
import { create } from "jss";
import createTheme from "../../theme";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { STARTING_LOCATION } from "../../constants";
import * as MapboxDrawGeodesic from "mapbox-gl-draw-geodesic";
import { RulerControl } from "mapbox-gl-controls";
import ResetZoomControl from "./ResetZoomControl";
import ToggleBasemapControl from "./ToggleBasemapControl";
import DragCircleControl from "./DragCircleControl";
import {
  DUMMY_BASEMAP_LAYERS,
  handleCopyCoords,
  locationsLabelsLayer,
  locationsLayer,
  onPointClickSetCoordinateRefs,
  updateArea,
} from "../../utils/map";
import "mapbox-gl-controls/lib/controls.css";
import CoordinatesPopup from "./components/CoordinatesPopup";
import MeasurementsPopup from "./components/MeasurementsPopup";
import MainPopup from "./components/MainPopup";

import { useApp } from "../../AppProvider";
import debounce from "lodash.debounce";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const DashboardMap = ({
  data,
  isLoading,
  error,
  setCurrentSelectedPoint,
  radioValue,
  map,
  setMap,
  currentlyPaintedPointRef,
  coordinatesContainerRef,
  longRef,
  latRef,
  eleRef,
  setRadioValue = null,
  defaultFilterValue,
}) => {
  const theme = useSelector((state) => state.themeReducer);
  const { currentUser } = useApp();

  const [mapIsLoaded, setMapIsLoaded] = useState(false);

  const polygonRef = useRef(null);
  const radiusRef = useRef(null);
  const pointRef = useRef(null);
  const measurementsContainerRef = useRef(null);
  const mapContainerRef = useRef(null); // create a reference to the map container
  const popUpRef = useRef(
    new mapboxgl.Popup({ maxWidth: "310px", focusAfterOpen: false })
  );

  //create map and apply all controls
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/" + DUMMY_BASEMAP_LAYERS[0].url,
      center: STARTING_LOCATION,
      zoom: 9,
    });

    //adds control features as extended by MapboxDrawGeodesic (draw circle)
    let modes = MapboxDraw.modes;
    modes = MapboxDrawGeodesic.enable(modes);
    const draw = new MapboxDraw({
      modes,
      controls: {
        polygon: true,
        point: true,
        trash: true,
      },
      displayControlsDefault: false,
      userProperties: true,
    });

    //event listener to run function updateArea during each draw action to handle measurements popup
    const drawActions = ["draw.create", "draw.update", "draw.delete"];
    drawActions.forEach((item) => {
      map.on(item, (event) => {
        const geojson = event.features[0];
        const type = event.type;
        updateArea(
          geojson,
          type,
          polygonRef,
          radiusRef,
          pointRef,
          measurementsContainerRef,
          draw
        );
      });
    });

    //top left controls
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
    map.addControl(new ResetZoomControl(), "top-left");

    //top right controls
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");

    //loop through each base layer and add a layer toggle for that layer
    DUMMY_BASEMAP_LAYERS.forEach((layer) => {
      return map.addControl(
        new ToggleBasemapControl(layer.url, layer.icon),
        "top-right"
      );
    });

    //bottom right controls
    map.addControl(draw, "bottom-right");
    map.addControl(new DragCircleControl(draw), "bottom-right");
    map.addControl(
      new RulerControl({
        units: "feet",
        labelFormat: (n) => `${n.toFixed(2)} ft`,
      }),
      "bottom-right"
    );

    //bottom left controls
    map.addControl(
      new mapboxgl.ScaleControl({ unit: "imperial" }),
      "bottom-left"
    );

    map.on("load", () => {
      setMapIsLoaded(true);
      setMap(map);
    });
  }, []); // eslint-disable-line

  //resizes map when mapContainerRef dimensions changes (sidebar toggle)
  useEffect(() => {
    if (map) {
      const resizer = new ResizeObserver(debounce(() => map.resize(), 100));
      resizer.observe(mapContainerRef.current);
      return () => {
        resizer.disconnect();
      };
    }
  }, [map]);

  //add source and layers
  //add event listeners
  useEffect(() => {
    if (mapIsLoaded && data?.length > 0 && typeof map != "undefined") {
      if (!map.getSource("locations")) {
        map.addSource("locations", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: data.map((location) => {
              return {
                type: "Feature",
                id: location.well_ndx,
                //no loop to create properties to customize the keys for a pretty popup
                properties: {
                  ...location,
                  ...{
                    is_well_owner: location?.authorized_users?.includes(
                      currentUser.sub
                    ),
                  },
                },
                geometry: {
                  type: location.location_geometry.type,
                  coordinates: location.location_geometry.coordinates,
                },
              };
            }),
          },
        });
        //add a layer showing the blue points, yellow/thick border when hovered.
        //if the user matches the id, the point is orange
        if (!map.getLayer("locations")) {
          map.addLayer(locationsLayer);

          //add labels for locations points
          map.addLayer(locationsLabelsLayer);
        }

        //makes currently selected point yellow
        //removes previously yellow colored point
        map.on("click", "locations", (e) => {
          if (e.features.length > 0) {
            if (currentlyPaintedPointRef.current) {
              map.setFeatureState(
                { source: "locations", id: currentlyPaintedPointRef.current },
                { clicked: false }
              );
            }
            currentlyPaintedPointRef.current = e.features[0].id;
            map.setFeatureState(
              { source: "locations", id: e.features[0].id },
              { clicked: true }
            );
          }
        });

        //set well number used to fetch data for graph
        //fly to point
        map.on("click", "locations", (e) => {
          setCurrentSelectedPoint(e.features[0].properties.cuwcd_well_number);
          map.flyTo({
            center: [
              e.features[0].properties.longitude_dd,
              e.features[0].properties.latitude_dd,
            ],
            zoom: 14,
            padding: { bottom: 250 },
          });
        });

        //sets ref.current.innerHTMLs for coordinates popup
        map.on("click", "locations", (e) =>
          onPointClickSetCoordinateRefs(
            coordinatesContainerRef,
            longRef,
            latRef,
            eleRef,
            e.features[0].properties.latitude_dd,
            e.features[0].properties.longitude_dd
          )
        );

        //handles main point click popup
        map.on("click", "locations", (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          // // Ensure that if the map is zoomed out such that multiple
          // // copies of the feature are visible, the popup appears
          // // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          const excludedPopupFields = [
            "id",
            "has_production",
            "has_waterlevels",
            "has_wqdata",
            "well_ndx",
            "location_geometry",
            "authorized_users",
            "is_well_owner",
            "tableData",
            "is_permitted",
            "is_exempt",
            "is_monitoring",
            "well_type",
            "tableData",
          ];

          let feature = e.features[0].properties;

          const popupNode = document.createElement("div");
          ReactDOM.render(
            //MJB adding style providers to the popup
            <StylesProvider jss={jss}>
              <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
                <ThemeProvider theme={createTheme(theme.currentTheme)}>
                  <MainPopup
                    excludeFields={excludedPopupFields}
                    feature={feature}
                    currentUser={currentUser}
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

          map.on("closeAllPopups", () => {
            popUpRef.current.remove();
          });
        });

        // //handles copying coordinates and measurements to the clipboard
        const copyableRefs = [
          longRef,
          latRef,
          eleRef,
          polygonRef,
          radiusRef,
          pointRef,
        ];
        copyableRefs.forEach((ref) => {
          ref.current.addEventListener("click", (e) =>
            handleCopyCoords(e.target.innerHTML)
          );
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on("mouseenter", "locations", () => {
          map.getCanvas().style.cursor = "pointer";

          map.on("mouseleave", "locations", () => {
            map.getCanvas().style.cursor = "";
          });
        });

        //changes the border of the hovered point to yellow and a thicker border
        let hoverID = null;
        map.on("mousemove", "locations", (e) => {
          if (e.features.length === 0) return;

          //removes hover-state border if the hovered hoverID changes
          if (hoverID) {
            map.setFeatureState(
              {
                source: "locations",
                id: hoverID,
              },
              {
                hover: false,
              }
            );
          }

          hoverID = e.features[0].id;

          //adds hover-state border
          map.setFeatureState(
            {
              source: "locations",
              id: hoverID,
            },
            {
              hover: true,
            }
          );
        });

        // When the mouse leaves the currently hovered item, change the border back to normal
        map.on("mouseleave", "locations", () => {
          if (hoverID) {
            map.setFeatureState(
              {
                source: "locations",
                id: hoverID,
              },
              {
                hover: false,
              }
            );
          }
          hoverID = null;
        });

        //all layers need to load, then filter out those that don't have production
        setRadioValue && setRadioValue(defaultFilterValue);
      }
    }
  }, [isLoading, mapIsLoaded, map, data]); // eslint-disable-line

  //filters the table based on the selected radioValues filters
  useEffect(() => {
    if (map !== undefined && map.getLayer("locations")) {
      if (radioValue === "all") {
        map.setFilter("locations", null);
        map.setFilter("locations-labels", null);
      } else {
        map.setFilter("locations", ["get", radioValue]);
        map.setFilter("locations-labels", ["get", radioValue]);
      }
    }
  }, [data]); // eslint-disable-line

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <MapContainer ref={mapContainerRef}>
        <CoordinatesPopup
          coordinatesContainerRef={coordinatesContainerRef}
          longRef={longRef}
          latRef={latRef}
          eleRef={eleRef}
          title="Most recently selected well:"
        />
        <MeasurementsPopup
          measurementsContainerRef={measurementsContainerRef}
          radiusRef={radiusRef}
          polygonRef={polygonRef}
          pointRef={pointRef}
        />
      </MapContainer>
    </>
  );
};

export default DashboardMap;
