import { useRef } from "react";

import AppBar from "../../components/AppBar";
import FiltersBar from "./filters";
import Map from "./map";

import { useMap } from "./mapContext";
import { INIT_MAP_CONFIG } from "./constants";

const PublicMap = () => {
  const mapContainer = useRef(null);
  const { layers, map, sources } = useMap(mapContainer, INIT_MAP_CONFIG);

  const handleSearchSelect = (result) => {
    map?.flyTo({ center: result?.location_geometry?.coordinates, zoom: 16 });
  };

  return (
    <>
      <AppBar />
      <FiltersBar onSearchSelect={handleSearchSelect} />
      <Map ref={mapContainer} />
    </>
  );
};

export default PublicMap;
