import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "mapbox-gl-draw";
import area from "@turf/area";
import styled from "styled-components/macro";
import ResetZoomControl from "./ResetZoomControl";
import { STARTING_LOCATION } from "../../constants";
import ToggleBasemapControl from "./ToggleBasemapControl";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "@material-ui/core";
import { formatBooleanTrueFalse } from "../../utils";
import { useApp } from "../../AppProvider";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const CoordinatesContainer = styled.pre`
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
  z-index: 1000;
  display: none;
`;

const PolygonContainer = styled.pre`
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: absolute;
  bottom: 40px;
  right: 10px;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  z-index: 1000;
  display: none;
`;

// const DistanceContainer = styled.pre`
//   background: rgba(0, 0, 0, 0.5);
//   color: #fff;
//   position: absolute;
//   bottom: 100px;
//   right: 10px;
//   padding: 5px 10px;
//   margin: 0;
//   font-size: 11px;
//   line-height: 18px;
//   border-radius: 3px;
//   z-index: 1000;
//   display: block;
// `;

const Coord = styled.span`
  cursor: copy;
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
    maxHeight: 200,
    overflowY: "scroll",
  },
}));

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
}) => {
  const { currentUser } = useApp();
  const classes = useStyles();
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const polygonRef = useRef(null);
  const polygonContainerRef = useRef(null);
  const mapContainerRef = useRef(null); // create a reference to the map container

  const DUMMY_BASEMAP_LAYERS = [
    { url: "streets-v11", icon: "commute" },
    { url: "outdoors-v11", icon: "park" },
    { url: "satellite-streets-v11", icon: "satellite_alt" },
  ];

  const handleCopyCoords = (value) => {
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = value;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  function onPointClick(e) {
    coordinatesContainerRef.current.style.display = "block";
    longRef.current.innerHTML = e.features[0].properties["Longitude (dd)"];
    latRef.current.innerHTML = e.features[0].properties["Latitude (dd)"];
  }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/" + DUMMY_BASEMAP_LAYERS[0].url,
      center: STARTING_LOCATION,
      zoom: 9,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: "draw_polygon",
    });
    map.addControl(draw);

    map.on("draw.create", updateArea);
    map.on("draw.delete", updateArea);
    map.on("draw.update", updateArea);

    function updateArea(e) {
      polygonContainerRef.current.style.display = "block";
      const data = draw.getAll();
      const answer = polygonRef.current;
      if (data.features.length > 0) {
        const exactArea = area(data);
        // Restrict the area to 2 decimal points.
        const rounded_area = Math.round(exactArea * 100) / 100;
        answer.innerHTML = rounded_area;
      } else {
        answer.innerHTML = "";
        polygonContainerRef.current.style.display = "none";
        if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
      }
    }

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
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: data.map((location) => {
              return {
                type: "Feature",
                id: location.well_ndx,
                properties: {
                  "CUWCD Well #": location.cuwcd_well_number,
                  "Exempt?": location.exempt,
                  "Well Name": location.well_name,
                  "State Well #": location.state_well_number,
                  "Well Status": location.well_status,
                  "Source Aquifer": location.source_aquifer,
                  "Well Depth (ft)": location.well_depth_ft,
                  "Elevation (ft msl)": location.elevation_ftabmsl,
                  "Screen Top Depth (ft)": location.screen_top_depth_ft,
                  "Screen Bottom Depth (ft)": location.screen_bottom_depth_ft,
                  "Primary Use": location.primary_use,
                  "Secondary Use": location.secondary_use,
                  "Aggregation System": location.agg_system_name,
                  "Permit #": location.permit_number,
                  "Well Owner": location.well_owner,
                  "Well Owner Address": location.well_owner_address,
                  "Well Owner Phone": location.well_owner_phone,
                  "Well Owner Email": location.well_owner_email,
                  "Well Contact": location.well_contact,
                  "Well Contact Address": location.well_contact_address,
                  "Well Contact Phone": location.well_contact_phone,
                  "Well Contact Email": location.well_contact_email,
                  Driller: location.driller,
                  "Date Drilled": location.date_drilled,
                  "Drillers Log?": location.drillers_log,
                  "General Notes": location.general_notes,
                  "Well Remarks": location.well_remarks,
                  "Count of Production Entries": location.count_production,
                  "Count of Water Levels Entries": location.count_waterlevels,
                  "Count of WQ Data Entries": location.count_wqdata,
                  "Longitude (dd)": location.longitude_dd,
                  "Latitude (dd)": location.latitude_dd,
                  "Registration Notes": location.registration_notes,
                  "Registration Date": location.registration_date,
                  Editor: location.editor_name,
                  "Last Edited Date": location.last_edited_date,
                  "List of Attachments": location.list_of_attachments,
                  id: location.id,
                  has_production: location.has_production,
                  has_waterlevels: location.has_waterlevels,
                  has_wqdata: location.has_wqdata,
                  well_ndx: location.well_ndx,
                  location_geometry: location.location_geometry,
                  authorized_users: location.authorized_users,
                  well_owner: location?.authorized_users?.includes(
                    currentUser.sub
                  ),
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
        if (!map.getLayer("locations")) {
          map.addLayer({
            id: "locations",
            type: "circle",
            source: "locations",
            paint: {
              "circle-radius": 8,
              "circle-color": [
                "case",
                ["boolean", ["feature-state", "clicked"], false],
                "yellow",
                ["boolean", ["get", "well_owner"], false],
                "red",
                "#74E0FF",
              ],
              "circle-stroke-width": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                2,
                1,
              ],
              "circle-stroke-color": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                "yellow",
                "black",
              ],
            },
          });

          map.addLayer({
            id: "locations-labels",
            type: "symbol",
            source: "locations",
            minzoom: 12,
            layout: {
              "text-field": ["get", "CUWCD Well #"],
              "text-offset": [0, -2],
              "text-size": 14,
            },
            paint: {
              "text-halo-color": "#ffffff",
              "text-halo-width": 0.5,
            },
          });
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
        //fly to graph
        map.on("click", "locations", (e) => {
          setCurrentSelectedPoint(e.features[0].properties["CUWCD Well #"]);
          map.flyTo({
            center: [
              e.features[0].properties["Longitude (dd)"],
              e.features[0].properties["Latitude (dd)"],
            ],
            zoom: 14,
            padding: { bottom: 250 },
          });
        });

        //for lat/long display
        map.on("click", "locations", onPointClick);

        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on("click", "locations", (e) => {
          let popup = new mapboxgl.Popup({ maxWidth: "310px" });

          let data = e.features[0].properties;

          // Copy coordinates array.
          const coordinates = e.features[0].geometry.coordinates.slice();

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          const canUserEdit = currentUser.isUser
            ? ""
            : `<tr><td><strong>Edit Well</strong></td><td><a href="/models/dm-wells/${data.id}">Link</a></td></tr>`;

          const html =
            '<div class="' +
            classes.popupWrap +
            '"><h3>Properties</h3><table class="' +
            classes.propTable +
            '"><tbody>' +
            canUserEdit +
            Object.entries(data)
              .map(([k, v]) => {
                if (
                  [
                    "id",
                    "has_production",
                    "has_waterlevels",
                    "has_wqdata",
                    "well_ndx",
                    "location_geometry",
                    "authorized_users",
                    "well_owner",
                  ].includes(k)
                )
                  return null;
                return `<tr><td><strong>${k}</strong></td><td>${formatBooleanTrueFalse(
                  v
                )}</td></tr>`;
              })
              .join("") +
            "</tbody></table></div>";

          popup.setLngLat(coordinates).setHTML(html).addTo(map);

          map.on("closeAllPopups", () => {
            popup.remove();
          });
        });

        longRef.current.addEventListener("click", (e) =>
          handleCopyCoords(e.target.innerHTML)
        );
        latRef.current.addEventListener("click", (e) =>
          handleCopyCoords(e.target.innerHTML)
        );
        polygonRef.current.addEventListener("click", (e) =>
          handleCopyCoords(e.target.innerHTML)
        );

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on("mouseenter", "locations", () => {
          map.getCanvas().style.cursor = "pointer";

          map.on("mouseleave", "locations", () => {
            map.getCanvas().style.cursor = "";
          });
        });

        let hoverID = null;

        map.on("mousemove", "locations", (e) => {
          if (e.features.length === 0) return;

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

        // When the mouse leaves the earthquakes-viz layer, update the
        // feature state of the previously hovered feature
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
      <MapContainer ref={mapContainerRef}>
        <CoordinatesContainer ref={coordinatesContainerRef}>
          Longitude:{" "}
          <Tooltip title="Copy Longitude to Clipboard">
            <Coord ref={longRef} />
          </Tooltip>
          <br />
          Latitude:{" "}
          <Tooltip title="Copy Latitude to Clipboard" placement="bottom-start">
            <Coord ref={latRef} />
          </Tooltip>
        </CoordinatesContainer>
        {/*<DistanceContainer>*/}
        {/*  Click the map to measure the distance between points*/}
        {/*  <br />*/}
        {/*  <Tooltip title="Copy Distance to Clipboard" placement="bottom-start">*/}
        {/*    <Coord ref={polygonRef} />*/}
        {/*  </Tooltip>*/}
        {/*</DistanceContainer>*/}
        <PolygonContainer ref={polygonContainerRef}>
          Total polygon area:
          <br />
          <Tooltip
            title="Copy Measurement to Clipboard"
            placement="bottom-start"
          >
            <Coord ref={polygonRef} />
          </Tooltip>{" "}
          square meters
        </PolygonContainer>
      </MapContainer>
    </>
  );
};

export default DashboardMap;
