import { useRef } from "react";

import AppBar from "../../components/AppBar";
import Map from "./map";

import { useMap } from "./mapContext";
import { INIT_MAP_CONFIG } from "./constants";

const PublicMap = () => {
  const mapContainer = useRef(null);
  const { layers, sources } = useMap(mapContainer, INIT_MAP_CONFIG);

  return (
    <>
      <AppBar />
      <Map ref={mapContainer} />
    </>
  );
};

export default PublicMap;
