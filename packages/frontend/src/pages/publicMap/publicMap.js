import React, { useRef } from "react";
import styled from "styled-components/macro";
import {
  Box,
  MenuItem,
  Paper,
  TextField as MuiTextField,
  Typography,
} from "@material-ui/core";

// import AppBar from "../../components/AppBar";
import Map from "./map";
import WellStylesControl from "./controls/wellStylesControl";
import ZoomInfo from "./controls/zoomInfo";
import Search from "./filters/search";
import FilterControl from "./filters/filterControl";
import Filter from "./filters/filter";

import { useMap } from "./hooks/useMap";
import useFilters from "./hooks/useFilters";
import useLayerStyles from "./hooks/useLayerStyles";
import { INIT_MAP_CONFIG, WELLS_SEARCH_OPTIONS } from "./constants";

import DisclaimerDialog from "./components/DisclaimerDialog";
import MeasurementsPopup from "../../components/map/components/MeasurementsPopup";
import MainControl from "./controls/mainControl/";
import AddressSearchControl from "./controls/addressSearchControl";
import CommaSeparatedWellsSearch from "./filters/commaSeparatedWellsSearch";

const FiltersBar = styled(Paper)`
  align-items: center;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(6)}px;
  padding: 12px 16px 12px 32px;
`;

const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)}px;
`;

const FiltersSectionRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)}px;
  flex-grow: 100;
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)}px;
  flex-grow: 100;
`;

const TextField = styled(MuiTextField)`
  width: 120px;
  display: flex;
`;

const getMoreFiltersCount = (filterValues) => {
  const keys = [
    "hasProduction",
    "hasWaterLevels",
    "hasWQData",
    "isPermitted",
    "isExempt",
    "isMonitoring",
  ];
  return keys.filter((key) => filterValues[key].value).length;
};

const PublicMap = () => {
  const mapContainer = useRef(null);
  const {
    activeBasemap,
    basemaps,
    layers,
    map,
    zoomLevel,
    updateLayerFilters,
    updateLayerStyles,
    updateLayerVisibility,
    updateBasemap,
    polygonRef,
    radiusRef,
    pointRef,
    measurementsContainerRef,
  } = useMap(mapContainer, INIT_MAP_CONFIG);
  const {
    filterValues,
    handleFilterValues,
    handleSelectAll,
    handleSelectNone,
  } = useFilters({ onFilterChange: updateLayerFilters });
  const { activeStyle, handleActiveStyle, styleOptions } = useLayerStyles({
    onLayerStyleChange: updateLayerStyles,
  });
  const handleSearchSelect = (result) => {
    map?.flyTo({ center: result?.location_geometry?.coordinates, zoom: 16 });
  };

  return (
    <>
      {process.env.NODE_ENV !== "development" && <DisclaimerDialog />}
      <FiltersBar>
        <FiltersContainer>
          <TextField
            variant="outlined"
            select
            fullWidth
            size="small"
            label="Search Options"
            value={filterValues?.search?.value}
            onChange={handleFilterValues}
            name="search"
          >
            {WELLS_SEARCH_OPTIONS.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>

          {filterValues?.search?.value === "attributes_search" && (
            <FiltersSectionRow>
              <Search onSelect={handleSearchSelect} />
            </FiltersSectionRow>
          )}
          {filterValues?.search?.value === "comma_separated_wells_search" && (
            <FiltersSectionRow>
              <CommaSeparatedWellsSearch map={map} />
            </FiltersSectionRow>
          )}
        </FiltersContainer>

        {filterValues?.search?.value === "attributes_search" && (
          <FiltersSection>
            <FiltersContainer>
              <FilterControl
                appliedCount={filterValues?.aquifers?.value?.length}
                label="Aquifers"
              >
                <Filter
                  label="Aquifers"
                  name="aquifers"
                  onChange={handleFilterValues}
                  onSelectAll={handleSelectAll}
                  onSelectNone={handleSelectNone}
                  options={filterValues?.aquifers?.options}
                  type={filterValues?.aquifers?.type}
                  value={filterValues?.aquifers?.value}
                />
              </FilterControl>
              <FilterControl
                appliedCount={filterValues?.primaryUses?.value?.length}
                label="Primary Use"
              >
                <Filter
                  label="Primary Use"
                  name="primaryUses"
                  onChange={handleFilterValues}
                  onSelectAll={handleSelectAll}
                  onSelectNone={handleSelectNone}
                  options={filterValues?.primaryUses?.options}
                  type={filterValues?.primaryUses?.type}
                  value={filterValues?.primaryUses?.value}
                />
              </FilterControl>
              <FilterControl
                appliedCount={filterValues?.wellStatus?.value?.length}
                label="Well Status"
              >
                <Filter
                  label="Well Status"
                  name="wellStatus"
                  onChange={handleFilterValues}
                  onSelectAll={handleSelectAll}
                  onSelectNone={handleSelectNone}
                  options={filterValues?.wellStatus?.options}
                  type={filterValues?.wellStatus?.type}
                  value={filterValues?.wellStatus?.value}
                />
              </FilterControl>
              {/*MJB hide aggregated system control per client (probably temporary)*/}
              {/*<FilterControl*/}
              {/*  appliedCount={filterValues?.aggregatedSystems?.value?.length}*/}
              {/*  label="Aggregated System"*/}
              {/*>*/}
              {/*  <Filter*/}
              {/*    label="Aggregated System"*/}
              {/*    name="aggregatedSystems"*/}
              {/*    onChange={handleFilterValues}*/}
              {/*    onSelectAll={handleSelectAll}*/}
              {/*    onSelectNone={handleSelectNone}*/}
              {/*    options={filterValues?.aggregatedSystems?.options}*/}
              {/*    type={filterValues?.aggregatedSystems?.type}*/}
              {/*    value={filterValues?.aggregatedSystems?.value}*/}
              {/*  />*/}
              {/*</FilterControl>*/}
              <FilterControl
                appliedCount={getMoreFiltersCount(filterValues)}
                label="More Filters"
              >
                <Box display="flex" flexDirection="column">
                  <Filter
                    label="Has Production"
                    name="hasProduction"
                    onChange={handleFilterValues}
                    type="boolean"
                    value={filterValues?.hasProduction?.value}
                  />
                  <Filter
                    label="Has Water Levels"
                    name="hasWaterLevels"
                    onChange={handleFilterValues}
                    type="boolean"
                    value={filterValues?.hasWaterLevels?.value}
                  />
                  <Filter
                    label="Has Water Quality Data"
                    name="hasWQData"
                    onChange={handleFilterValues}
                    type="boolean"
                    value={filterValues?.hasWQData?.value}
                  />
                  <Filter
                    label="Is Permitted"
                    name="isPermitted"
                    onChange={handleFilterValues}
                    type="boolean"
                    value={filterValues?.isPermitted?.value}
                  />
                  <Filter
                    label="Is Exempt"
                    name="isExempt"
                    onChange={handleFilterValues}
                    type="boolean"
                    value={filterValues?.isExempt?.value}
                  />
                  <Filter
                    label="Is Monitoring"
                    name="isMonitoring"
                    onChange={handleFilterValues}
                    type="boolean"
                    value={filterValues?.isMonitoring?.value}
                  />
                </Box>
              </FilterControl>
            </FiltersContainer>
          </FiltersSection>
        )}

        <FiltersSection>
          <FiltersContainer>
            <FilterControl label={`Color wells by ${activeStyle.name}`}>
              <Typography variant="subtitle1" gutterBottom>
                Color wells by
              </Typography>
              <WellStylesControl
                label="Color wells by"
                name="wellStyles"
                onChange={handleActiveStyle}
                options={styleOptions}
                value={activeStyle.id}
              />
            </FilterControl>
          </FiltersContainer>
        </FiltersSection>
      </FiltersBar>
      <Map ref={mapContainer}>
        <MeasurementsPopup
          measurementsContainerRef={measurementsContainerRef}
          radiusRef={radiusRef}
          polygonRef={polygonRef}
          pointRef={pointRef}
        />
        <AddressSearchControl
          onSelect={(coordinates) =>
            map?.flyTo({ center: coordinates, zoom: 16 })
          }
        />
        <MainControl
          activeBasemap={activeBasemap}
          basemaps={basemaps}
          layers={layers}
          onBasemapChange={updateBasemap}
          onLayerChange={updateLayerVisibility}
          value={filterValues?.search?.value}
        />
        {process.env.NODE_ENV === "development" && (
          <ZoomInfo zoomLevel={zoomLevel} />
        )}
      </Map>
    </>
  );
};

export default PublicMap;
