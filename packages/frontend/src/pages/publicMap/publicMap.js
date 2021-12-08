import { useRef } from "react";

import AppBar from "../../components/AppBar";
import FiltersBar from "./filters";
import Map from "./map";

import { useMap } from "./mapContext";
import { INIT_MAP_CONFIG } from "./constants";

const PublicMap = () => {
  const mapContainer = useRef(null);
  const { layers, sources } = useMap(mapContainer, INIT_MAP_CONFIG);

  return (
    <>
      <AppBar />
      <FiltersBar />
      <Map ref={mapContainer} />
    </>
  );
};

export default PublicMap;
