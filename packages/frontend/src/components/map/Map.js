import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import styled from "styled-components/macro";
import ResetZoomControl from "./ResetZoomControl";
import { STARTING_LOCATION } from "../../constants";
import ToggleBasemapControl from "./ToggleBasemapControl";
import { makeStyles } from "@material-ui/core/styles";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Coordinates = styled.pre`
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: absolute;
  bottom: 40px;
  left: 10px;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  z-index: 100000;
  display: none;
`;

const useStyles = makeStyles(() => ({
  propTable: {
    borderRadius: "5px",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
    "& td": {
      padding: "3px 6px",
      margin: 0,
    },
    "& tr:nth-child(even)": {
      backgroundColor: "#eee",
    },
    "& tr": {
      borderRadius: "5px",
    },
  },
  popupWrap: {
    maxHeight: 300,
    overflowY: "scroll",
  },
}));

const Map = ({
  data,
  isLoading,
  error,
  setCurrentSelectedPoint,
  radioValue,
  map,
  setMap,
}) => {
  const classes = useStyles();
  const [mapIsLoaded, setMapIsLoaded] = useState(false);

  const mapContainer = useRef(null); // create a reference to the map container
  const coordinates = useRef(null);
  const DUMMY_BASEMAP_LAYERS = [
    { url: "streets-v11", icon: "commute" },
    { url: "outdoors-v11", icon: "park" },
    { url: "satellite-streets-v11", icon: "satellite_alt" },
  ];

  function onPointClick(e) {
    coordinates.current.style.display = "block";
    coordinates.current.innerHTML = `Longitude: ${e.features[0].geometry.coordinates[0]}<br />Latitude: ${e.features[0].geometry.coordinates[1]}`;
  }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/" + DUMMY_BASEMAP_LAYERS[0].url,
      center: STARTING_LOCATION,
      zoom: 11,
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

    map.on("render", () => {
      map.resize();
    });
    map.on("load", () => {
      setMapIsLoaded(true);
      map.resize();
      setMap(map);
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    if (mapIsLoaded && data?.length > 0 && typeof map != "undefined") {
      if (!map.getSource("locations")) {
        map.addSource("locations", {
          // This GeoJSON contains features that include an "icon"
          // property. The value of the "icon" property corresponds
          // to an image in the Mapbox Streets style's sprite.
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: data.map((location) => {
              return {
                type: "Feature",
                properties: {
                  well_ndx: location.well_ndx,
                  cuwcd_well_number: location.cuwcd_well_number,
                  state_well_number: location.state_well_number,
                  longitude_dd: location.longitude_dd,
                  latitude_dd: location.latitude_dd,
                  source_aquifer: location.source_aquifer,
                  primary_use: location.primary_use,
                  well_owner: location.well_owner,
                  well_status: location.well_status,
                  location_geometry: location.location_geometry,
                  has_production: location.has_production,
                  has_waterlevels: location.has_waterlevels,
                  has_wqdata: location.has_wqdata,
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
        map.addLayer({
          id: "locations",
          type: "circle",

          source: "locations",
          paint: {
            "circle-radius": 8,
            "circle-color": "#74E0FF",
            "circle-stroke-width": 1,
            "circle-stroke-color": "black",
          },
        });

        map.addLayer({
          id: "locations-labels",
          type: "symbol",
          source: "locations",
          minzoom: 12,
          layout: {
            "text-field": ["get", "cuwcd_well_number"],
            "text-offset": [0, -2],
            "text-size": 14,
          },
          paint: {
            "text-halo-color": "#ffffff",
            "text-halo-width": 0.5,
          },
        });

        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on("click", "locations", (e) => {
          setCurrentSelectedPoint(e.features[0].properties.cuwcd_well_number);
          map.flyTo({
            center: [
              e.features[0].properties.longitude_dd,
              e.features[0].properties.latitude_dd,
            ],
            // zoom: 12,
            padding: { bottom: 340 },
          });
        });

        //for lat/long display
        map.on("click", "locations", onPointClick);

        map.on("click", "locations", (e) => {
          let popup = new mapboxgl.Popup({ maxWidth: "300px" });

          let data = e.features[0].properties;

          // Copy coordinates array.
          const coordinates = e.features[0].geometry.coordinates.slice();
          // const description = data.cuwcd_well_number;
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup
            .setLngLat(coordinates)
            .setHTML(
              '<div class="' +
                classes.popupWrap +
                '"><h3>Properties</h3><table class="' +
                classes.propTable +
                '"><tbody>' +
                Object.entries(data)
                  .map(([k, v]) => {
                    if (
                      k === "hlink" ||
                      k === "URL" ||
                      k === "MoreInfo" ||
                      k === "datacall"
                    ) {
                      return `<tr><td><strong>${k}</strong></td><td><a href="${v}" target="_blank">Link</a></td></tr>`;
                    }
                    return `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`;
                  })
                  .join("") +
                "</tbody></table></div>"
            )
            .addTo(map);

          map.on("closeAllPopups", () => {
            popup.remove();
          });
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on("mouseenter", "locations", () => {
          map.getCanvas().style.cursor = "pointer";

          map.on("mouseleave", "locations", () => {
            map.getCanvas().style.cursor = "";
          });
        });

        // Change it back to a pointer when it leaves.
      }
    }
  }, [isLoading, mapIsLoaded, map, data]); // eslint-disable-line

  useEffect(() => {
    if (map !== undefined) {
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
      <MapContainer ref={mapContainer}>
        <Coordinates ref={coordinates} />
      </MapContainer>
    </>
  );
};

export default Map;
