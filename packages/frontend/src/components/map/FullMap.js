import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import { STARTING_LOCATION } from "../../constants";
import ToggleBasemapControl from "./ToggleBasemapControl";
import ResetZoomControl from "./ResetZoomControl";
import { Tooltip } from "@material-ui/core";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Container = styled.div`
  height: calc(100vh - 68px - 48px - 48px - 60px);
  width: 100%;
`;

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
  z-index: 1000;
  display: none;
`;

const Coord = styled.span`
  cursor: copy;
`;

const Map = () => {
  const [map, setMap] = useState();
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const coordinatesRef = useRef(null);
  const longRef = useRef(null);
  const latRef = useRef(null);
  const mapContainerRef = useRef(null); // create a reference to the map container

  const DUMMY_BASEMAP_LAYERS = [
    { url: "streets-v11", icon: "commute" },
    { url: "outdoors-v11", icon: "park" },
    { url: "satellite-streets-v11", icon: "satellite_alt" },
  ];

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/" + DUMMY_BASEMAP_LAYERS[0].url,
      center: STARTING_LOCATION,
      zoom: 9,
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
    if (mapIsLoaded && typeof map != "undefined") {
      const marker = new mapboxgl.Marker({
        draggable: true,
      })
        .setLngLat(STARTING_LOCATION)
        .addTo(map);

      const onDragEnd = () => {
        const lngLat = marker.getLngLat();
        coordinatesRef.current.style.display = "block";

        longRef.current.innerHTML = lngLat.lng;
        latRef.current.innerHTML = lngLat.lat;
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

      marker.on("dragend", onDragEnd);
    }
  });

  return (
    <>
      <Container>
        <MapContainer ref={mapContainerRef}>
          <Coordinates ref={coordinatesRef}>
            Longitude:
            <Tooltip title="Copy Longitude to Clipboard">
              <Coord ref={longRef} />
            </Tooltip>
            <br />
            Latitude:
            <Tooltip
              title="Copy Latitude to Clipboard"
              placement="bottom-start"
            >
              <Coord ref={latRef} />
            </Tooltip>
          </Coordinates>
        </MapContainer>
      </Container>
    </>
  );
};

export default Map;
