import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as MapboxDrawGeodesic from "mapbox-gl-draw-geodesic";
import { RulerControl } from "mapbox-gl-controls";
import area from "@turf/area";
import styled from "styled-components/macro";
import { STARTING_LOCATION } from "../../constants";
import {
  Accordion,
  AccordionDetails,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import debounce from "lodash.debounce";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Container = styled.div`
  height: 300px;
  width: 100%;
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const CoordinatesContainer = styled.pre`
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  position: absolute;
  top: 49px;
  left: 10px;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  z-index: 1000;
  display: none;
`;

const MeasurementsContainer = styled.pre`
  background: rgba(0, 0, 0, 0.7);
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

const Instructions = styled.div`
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  position: absolute;
  text-align: center;
  left: 50%;
  margin-right: -50%;

  transform: translate(-50%, 0);
  padding: 5px 10px;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  z-index: 1000;
  display: block;
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

const Map = ({ config }) => {
  const [map, setMap] = useState();
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const coordinatesContainerRef = useRef(null);
  const instructionsRef = useRef(null);
  const longRef = useRef(null);
  const latRef = useRef(null);
  const eleRef = useRef(null);
  const polygonRef = useRef(null);
  const radiusRef = useRef(null);
  const pointRef = useRef(null);
  const measurementContainerRef = useRef(null);
  const mapContainerRef = useRef(null); // create a reference to the map container

  async function getElevation(transferElevation = true) {
    // Construct the API request.
    const query = await fetch(
      `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${longRef.current.innerHTML},${latRef.current.innerHTML}.json?layers=contour&limit=50&access_token=${mapboxgl.accessToken}`,
      { method: "GET" }
    );
    if (query.status !== 200) return;
    const data = await query.json();

    const allFeatures = data.features;

    const elevations = allFeatures.map((feature) => feature.properties.ele);

    eleRef.current.innerHTML = Math.max(...elevations) * 3.28084;
    if (transferElevation) {
      config.setFieldValue("elevation_ftabmsl", eleRef.current.innerHTML);
    }
  }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v11",
      center:
        config.data.longitude_dd === "" || config.data.latitude_dd === ""
          ? STARTING_LOCATION
          : [config.data.longitude_dd, config.data.latitude_dd],
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
        icon.type = "button";
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

    map.addControl(new mapboxgl.FullscreenControl());

    map.addControl(new mapboxgl.ScaleControl({ unit: "imperial" }));

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
    if (mapIsLoaded && typeof map != "undefined") {
      const marker = new mapboxgl.Marker({
        draggable: true,
      })
        .setLngLat(
          config.data.longitude_dd === "" || config.data.latitude_dd === ""
            ? STARTING_LOCATION
            : [config.data.longitude_dd, config.data.latitude_dd]
        )
        .addTo(map);

      if (config.data.longitude_dd && config.data.latitude_dd) {
        const lngLat = marker.getLngLat();
        coordinatesContainerRef.current.style.display = "block";
        instructionsRef.current.innerHTML =
          "Drag and place marker to update coordinates and elevation fields";

        longRef.current.innerHTML = lngLat.lng;
        latRef.current.innerHTML = lngLat.lat;
        getElevation(!config.data.elevation_ftabmsl);
      }

      const onDragEnd = () => {
        const lngLat = marker.getLngLat();
        coordinatesContainerRef.current.style.display = "block";
        instructionsRef.current.innerHTML =
          "Click coordinate or elevation to copy individual result to clipboard";

        longRef.current.innerHTML = lngLat.lng;
        config.setFieldValue("longitude_dd", lngLat.lng);
        latRef.current.innerHTML = lngLat.lat;
        config.setFieldValue("latitude_dd", lngLat.lat);
        getElevation();
      };
      const handleCopyCoords = (value) => {
        const dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.value = value;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
      };

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

      marker.on("dragend", onDragEnd);
    }
  }, [mapIsLoaded, map]); //eslint-disable-line

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="map"
          id="map"
          style={{ padding: "0" }}
        >
          <Typography variant="h4" ml={2}>
            Map (Coordinates & Elevation Selector)
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ padding: "0" }}>
          <Container>
            <MapContainer ref={mapContainerRef}>
              <CoordinatesContainer ref={coordinatesContainerRef}>
                <strong>Blue marker: </strong>
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
                <Tooltip
                  title="Copy Radius to Clipboard"
                  placement="left-start"
                >
                  <Measurement ref={radiusRef} />
                </Tooltip>
                <strong>Total polygon area:</strong>
                <br />
                <Tooltip title="Copy Area to Clipboard" placement="left-start">
                  <Measurement ref={polygonRef} />
                </Tooltip>
                <strong>Most recently edited point coordinates:</strong>
                <br />
                <Tooltip
                  title="Copy Coordinates to Clipboard"
                  placement="left-start"
                >
                  <Measurement ref={pointRef} />
                </Tooltip>
              </MeasurementsContainer>
              <Instructions ref={instructionsRef}>
                Drag and place marker to generate coordinates and elevation
                fields
              </Instructions>
            </MapContainer>
          </Container>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default Map;
