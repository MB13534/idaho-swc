import { useRef } from "react";
import styled from "styled-components/macro";
import { Paper, Typography } from "@material-ui/core";

import AppBar from "../../components/AppBar";
import Map from "./map";
import LayersControl from "./controls/layers";
import Search from "./filters/search";
import Filter from "./filters/filter";

import { useMap } from "./mapContext";
import useFilters from "./useFilters";
import { INIT_MAP_CONFIG } from "./constants";

const FiltersBar = styled(Paper)`
  align-items: flex-start;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: ${({ theme }) => theme.spacing(12)}px;
  padding: 12px 16px;
`;

const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)}px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)}px;
`;

const PublicMap = () => {
  const mapContainer = useRef(null);
  const { layers, map, updateLayerFilters, updateLayerVisibility } = useMap(
    mapContainer,
    INIT_MAP_CONFIG
  );
  const {
    filterValues,
    handleFilterValues,
    handleSelectAll,
    handleSelectNone,
  } = useFilters({ onFilterChange: updateLayerFilters });

  const handleSearchSelect = (result) => {
    map?.flyTo({ center: result?.location_geometry?.coordinates, zoom: 16 });
  };

  return (
    <>
      <AppBar />
      <FiltersBar>
        <FiltersSection>
          <Typography variant="subtitle1">Search Wells</Typography>
          <Search onSelect={handleSearchSelect} />
        </FiltersSection>
        <FiltersSection>
          <Typography variant="subtitle1">Filters</Typography>
          <FiltersContainer>
            <Filter
              label="Aquifers"
              name="aquifers"
              onChange={handleFilterValues}
              onSelectAll={handleSelectAll}
              onSelectNone={handleSelectNone}
              options={filterValues?.aquifers?.options}
              value={filterValues?.aquifers?.value}
            />
            <Filter
              label="Primary Use"
              name="primaryUses"
              onChange={handleFilterValues}
              onSelectAll={handleSelectAll}
              onSelectNone={handleSelectNone}
              options={filterValues?.primaryUses?.options}
              value={filterValues?.primaryUses?.value}
            />
            <Filter
              label="Well Status"
              name="wellStatus"
              onChange={handleFilterValues}
              onSelectAll={handleSelectAll}
              onSelectNone={handleSelectNone}
              options={filterValues?.wellStatus?.options}
              value={filterValues?.wellStatus?.value}
            />
          </FiltersContainer>
        </FiltersSection>
      </FiltersBar>
      <Map ref={mapContainer}>
        <LayersControl items={layers} onLayerChange={updateLayerVisibility} />
      </Map>
    </>
  );
};

export default PublicMap;
