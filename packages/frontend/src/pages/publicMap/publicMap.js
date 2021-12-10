import { useRef } from "react";

import AppBar from "../../components/AppBar";
import FiltersBar from "./filters";
import Map from "./map";
import LayersControl from "./controls/layers";

import { useMap } from "./mapContext";
import useFilters from "./useFilters";
import { INIT_MAP_CONFIG } from "./constants";

const PublicMap = () => {
  const mapContainer = useRef(null);
  const { layers, map, sources, updateLayerFilters, updateLayerVisibility } =
    useMap(mapContainer, INIT_MAP_CONFIG);

  const handleSearchSelect = (result) => {
    map?.flyTo({ center: result?.location_geometry?.coordinates, zoom: 16 });
  };

  return (
    <>
      <AppBar />
      <FiltersBar
        onSearchSelect={handleSearchSelect}
        onFilterChange={updateLayerFilters}
      />
      <Map ref={mapContainer}>
        <LayersControl items={layers} onLayerChange={updateLayerVisibility} />
      </Map>
    </>
  );
};

export default PublicMap;
