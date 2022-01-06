import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as MapboxDrawGeodesic from "mapbox-gl-draw-geodesic";
import { RulerControl } from "mapbox-gl-controls";
import area from "@turf/area";
import styled from "styled-components/macro";
import ResetZoomControl from "./ResetZoomControl";
import { STARTING_LOCATION } from "../../constants";
import ToggleBasemapControl from "./ToggleBasemapControl";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "@material-ui/core";
import { formatBooleanTrueFalse, lineColors, getElevation } from "../../utils";
import { useApp } from "../../AppProvider";
import debounce from "lodash.debounce";

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
  top: 10px;
  left: 49px;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  z-index: 1000;
  display: none;
`;

const MeasurementsContainer = styled.pre`
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: absolute;
  bottom: 30px;
  right: 49px;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  z-index: 1000;
  display: none;
`;

const Coord = styled.span`
  cursor: copy;
`;

const Measurement = styled.div`
  cursor: copy;
  margin-left: 10px;
`;

const MarginLeft = styled.span`
  margin-left: 10px;
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

const ProductionMap = ({
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
  setRadioValue,
  eleRef,
}) => {
  const { currentUser } = useApp();
  const classes = useStyles();
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const polygonRef = useRef(null);
  const radiusRef = useRef(null);
  const pointRef = useRef(null);
  const measurementContainerRef = useRef(null);
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
    (async function () {
      eleRef.current.innerHTML = await getElevation(
        e.features[0].properties["Longitude (dd)"],
        e.features[0].properties["Latitude (dd)"]
      );
    })();
  }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/" + DUMMY_BASEMAP_LAYERS[0].url,
      center: STARTING_LOCATION,
      zoom: 9,
    });

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

    class CircleDraw {
      onAdd() {
        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

        const icon = document.createElement("button");
        icon.className = "material-icons";
        icon.style.verticalAlign = "middle";
        icon.style.cursor = "pointer";
        icon.textContent = "trip_origin";
        this._container.appendChild(icon);
        this._container.addEventListener("click", () => {
          draw.changeMode("draw_circle");
        });
        return this._container;
      }

      onRemove() {
        this._container.parentNode.removeChild(this._container);
      }
    }
    map.addControl(draw, "bottom-right");

    map.on("draw.create", (event) => {
      const geojson = event.features[0];
      updateArea(geojson, event.type);
    });
    map.on("draw.update", (event) => {
      const geojson = event.features[0];
      updateArea(geojson, event.type);
    });

    map.on("draw.delete", (event) => {
      const geojson = event.features[0];
      updateArea(geojson, event.type);
    });

    function updateArea(geojson, type) {
      const data = draw.getAll();
      measurementContainerRef.current.style.display = "block";

      const answerArea = polygonRef.current;
      const answerRadius = radiusRef.current;
      const answerPoint = pointRef.current;

      if (geojson.properties.circleRadius && type !== "draw.delete") {
        const exactRadiusKm = geojson.properties.circleRadius;
        const exactRadiusFeet = exactRadiusKm * 3280.84;
        const roundedRadius = exactRadiusFeet.toFixed(2);
        answerRadius.innerHTML = roundedRadius + " ft";
      }

      if (geojson.geometry.type === "Point" && type !== "draw.delete") {
        answerPoint.innerHTML = `<strong>lat:</strong> ${geojson.geometry.coordinates[1]}<br /><strong>long:</strong> ${geojson.geometry.coordinates[0]}`;
      }

      if (
        data.features.filter((item) => item.geometry.type === "Point")
          .length === 0
      ) {
        answerPoint.innerHTML = "--";
      }
      if (
        data.features.filter((item) => item.properties.circleRadius).length ===
        0
      ) {
        answerRadius.innerHTML = "--";
      }

      if (data.features.length > 0) {
        const exactAreaMeters = area(data);
        const exactAreaFeet = exactAreaMeters * 10.7639;
        const roundedArea = exactAreaFeet.toFixed(2);
        answerArea.innerHTML = roundedArea + " sq ft";
      } else {
        answerArea.innerHTML = "";
        answerRadius.innerHTML = "";
        answerPoint.innerHTML = "";
        measurementContainerRef.current.style.display = "none";
        // if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
      }
    }

    map.addControl(new CircleDraw(), "bottom-right");

    map.addControl(
      new RulerControl({
        units: "feet",
        labelFormat: (n) => `${n.toFixed(2)} ft`,
      }),
      "bottom-right"
    );

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

    map.addControl(new mapboxgl.ScaleControl({ unit: "imperial" }));

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
    if (map) {
      const resizer = new ResizeObserver(debounce(() => map.resize(), 100));
      resizer.observe(mapContainerRef.current);
      return () => {
        resizer.disconnect();
      };
    }
  }, [map]);

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
                lineColors.yellow,
                ["boolean", ["get", "well_owner"], false],
                lineColors.orange,
                lineColors.lightBlue,
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
                lineColors.yellow,
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
        eleRef.current.addEventListener("click", (e) =>
          handleCopyCoords(e.target.innerHTML)
        );
        polygonRef.current.addEventListener("click", (e) =>
          handleCopyCoords(e.target.innerHTML)
        );
        radiusRef.current.addEventListener("click", (e) =>
          handleCopyCoords(e.target.innerHTML)
        );
        pointRef.current.addEventListener("click", (e) =>
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
        setRadioValue("has_production");
        // Change it back to a pointer when it leaves.
      }
    }
  }, [isLoading, mapIsLoaded, map, data]); // eslint-disable-line

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
        <CoordinatesContainer ref={coordinatesContainerRef}>
          <strong>Most recently selected well: </strong>
          <div>
            <MarginLeft>
              <strong>Longitude: </strong>
            </MarginLeft>
            <Tooltip title="Copy Longitude to Clipboard">
              <Coord ref={longRef} />
            </Tooltip>
          </div>
          <div>
            <MarginLeft>
              <strong>Latitude: </strong>
            </MarginLeft>
            <Tooltip
              title="Copy Latitude to Clipboard"
              placement="bottom-start"
            >
              <Coord ref={latRef} />
            </Tooltip>
          </div>
          <div>
            <MarginLeft>
              <strong>Elevation: </strong>
            </MarginLeft>
            <Tooltip
              title="Copy Elevation to Clipboard"
              placement="bottom-start"
            >
              <Coord ref={eleRef} />
            </Tooltip>{" "}
            ft
          </div>
        </CoordinatesContainer>
        <MeasurementsContainer ref={measurementContainerRef}>
          <strong>Most recently edited circle radius:</strong>
          <br />
          <Tooltip title="Copy Radius to Clipboard" placement="left-start">
            <Measurement ref={radiusRef} />
          </Tooltip>
          <strong>Total polygon area:</strong>
          <br />
          <Tooltip title="Copy Area to Clipboard" placement="left-start">
            <Measurement ref={polygonRef} />
          </Tooltip>
          <strong>Most recently edited point coordinates:</strong>
          <br />
          <Tooltip title="Copy Coordinates to Clipboard" placement="left-start">
            <Measurement ref={pointRef} />
          </Tooltip>
        </MeasurementsContainer>
      </MapContainer>
    </>
  );
};

export default ProductionMap;
