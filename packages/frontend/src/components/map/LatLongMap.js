import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as MapboxDrawGeodesic from "mapbox-gl-draw-geodesic";
import { RulerControl } from "mapbox-gl-controls";
import styled from "styled-components/macro";
import { STARTING_LOCATION } from "../../constants";
import { Accordion, AccordionDetails, Typography } from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import debounce from "lodash.debounce";
import DragCircleControl from "./DragCircleControl";
import { handleCopyCoords, updateArea } from "../../utils/map";
import CoordinatesPopup from "./components/CoordinatesPopup";
import MeasurementsPopup from "./components/MeasurementsPopup";
import { isTouchScreenDevice } from "../../utils";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

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

const Instructions = styled.div`
  background: rgba(0, 0, 0, 0.6);
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
  const measurementsContainerRef = useRef(null);
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

  const coordinatesGeocoder = function (query) {
    // Match anything which looks like
    // decimal degrees coordinate pair.
    const matches = query.match(
      /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );
    if (!matches) {
      return null;
    }

    function coordinateFeature(lng, lat) {
      return {
        center: [lng, lat],
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        place_name: "Lat: " + lat + " Lng: " + lng,
        place_type: ["coordinate"],
        properties: {},
        type: "Feature",
      };
    }

    const coord1 = Number(matches[1]);
    const coord2 = Number(matches[2]);
    const geocodes = [];

    if (coord1 >= -90 && coord1 <= 90 && coord2 >= -180 && coord2 <= 180) {
      // must be lat, lng
      geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (coord2 >= -90 && coord2 <= 90 && coord1 >= -180 && coord1 <= 180) {
      // must be lng, lat
      geocodes.push(coordinateFeature(coord1, coord2));
    }

    // if (geocodes.length === 0) {
    //   // else could be either lng, lat or lat, lng
    //   geocodes.push(coordinateFeature(coord1, coord2));
    //   // geocodes.push(coordinateFeature(coord2, coord1));
    // }

    return geocodes;
  };

  //create map and apply all controls
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v11",
      center:
        config.data.longitude_dd === "" || config.data.latitude_dd === ""
          ? STARTING_LOCATION
          : [config.data.longitude_dd, config.data.latitude_dd],
      zoom:
        config.data.longitude_dd === "" || config.data.latitude_dd === ""
          ? 9
          : 16,
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
    //none

    //top right controls
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");

    //bottom right controls
    //draw controls do not work correctly on touch screens
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 16,
        mapboxgl: mapboxgl,
        reverseGeocode: true,
      }),
      "bottom-right"
    );
    !isTouchScreenDevice() &&
      map.addControl(draw, "bottom-right") &&
      !isTouchScreenDevice() &&
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

      const onDragEnd = (marker) => {
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

      marker.on("dragend", () => onDragEnd(marker));

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
          handleCopyCoords(e.target.textContent)
        );
      });
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
              <CoordinatesPopup
                coordinatesContainerRef={coordinatesContainerRef}
                longRef={longRef}
                latRef={latRef}
                eleRef={eleRef}
                title="Blue marker:"
                top={"49px"}
                left={"10px"}
              />
              <MeasurementsPopup
                measurementsContainerRef={measurementsContainerRef}
                radiusRef={radiusRef}
                polygonRef={polygonRef}
                pointRef={pointRef}
              />
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
