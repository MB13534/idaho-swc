import React, { useRef, useState } from "react";
import styled from "styled-components/macro";
import {
  MenuItem,
  Paper,
  TextField as MuiTextField,
  Typography,
} from "@material-ui/core";

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

import PrintReportDialog from "./components/PrintReportDialog";
import { useReactToPrint } from "react-to-print";
import PrintMapFormat from "./components/PrintMapFormat";
import SplitButton from "../../components/SplitButton";
import MeasurementsControl from "./controls/MeasurementsControl";
import CommaSeparatedDataDotsSearch from "./filters/CommaSeparatedDataDotsSearch";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

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
  flex: 1 1 0;
`;

const TextField = styled(MuiTextField)`
  width: 125px;
  min-width: 125px;
  display: flex;
`;

// const getMoreFiltersCount = (filterValues) => {
//   const keys = [
//     "hasProduction",
//     "hasWaterLevels",
//     "hasWQData",
//     "isPermitted",
//     "isExempt",
//     "isMonitoring",
//   ];
//   return keys.filter((key) => filterValues[key].value).length;
// };

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
    measurementsVisible,
    handleClearMeasurements,
    setMeasurementsVisible,
    polygonRef,
    radiusRef,
    pointRef,
    lineRef,
    measurementsContainerRef,
    eventsRegistered,
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

  const printRef = useRef();
  const [printReportDialogOpen, setPrintReportDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const handlePrintMapClick = useReactToPrint({
    content: () => printRef.current,
  });

  const handleSavePNG = () => {
    const a = document.createElement("a");
    a.href = map.getCanvas().toDataURL();
    a.download = "map.png";
    document.body.appendChild(a);
    a.click();
  };

  const splitButtonOptions = ["Print PDF", "Save PNG"];
  const handleSplitButtonClick = (index) => {
    if (![0, 1].includes(index)) return;

    if (index === 0) {
      setPrintReportDialogOpen(true);
    } else if (index === 1) {
      handleSavePNG();
    }
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
          {filterValues?.search?.value ===
            "comma_separated_data_dots_search" && (
            <FiltersSectionRow>
              <CommaSeparatedDataDotsSearch map={map} />
            </FiltersSectionRow>
          )}
        </FiltersContainer>

        {filterValues?.search?.value === "attributes_search" && (
          <FiltersSection>
            <FiltersContainer>
              <FilterControl
                appliedCount={filterValues?.locationTypes?.value?.length}
                label="Location Types"
              >
                <Filter
                  label="Location Types"
                  name="locationTypes"
                  onChange={handleFilterValues}
                  onSelectAll={handleSelectAll}
                  onSelectNone={handleSelectNone}
                  options={filterValues?.locationTypes?.options}
                  type={filterValues?.locationTypes?.type}
                  value={filterValues?.locationTypes?.value}
                />
              </FilterControl>
              <FilterControl
                appliedCount={filterValues?.parameterNames?.value?.length}
                label="Parameter Names"
              >
                <Filter
                  label="Parameter Names"
                  name="parameterNames"
                  onChange={handleFilterValues}
                  onSelectAll={handleSelectAll}
                  onSelectNone={handleSelectNone}
                  options={filterValues?.parameterNames?.options}
                  type={filterValues?.parameterNames?.type}
                  value={filterValues?.parameterNames?.value}
                />
              </FilterControl>
              <FilterControl
                appliedCount={filterValues?.dataProviders?.value?.length}
                label="Data Provider"
              >
                <Filter
                  label="Data Providers"
                  name="dataProviders"
                  onChange={handleFilterValues}
                  onSelectAll={handleSelectAll}
                  onSelectNone={handleSelectNone}
                  options={filterValues?.dataProviders?.options}
                  type={filterValues?.dataProviders?.type}
                  value={filterValues?.dataProviders?.value}
                />
              </FilterControl>

              {/*<FilterControl*/}
              {/*  appliedCount={getMoreFiltersCount(filterValues)}*/}
              {/*  label="More Filters"*/}
              {/*>*/}
              {/*  <Box display="flex" flexDirection="column">*/}
              {/*    <Filter*/}
              {/*      label="Boolean 1"*/}
              {/*      name="hasProduction"*/}
              {/*      onChange={handleFilterValues}*/}
              {/*      type="boolean"*/}
              {/*      value={filterValues?.hasProduction?.value}*/}
              {/*    />*/}
              {/*    <Filter*/}
              {/*      label="Boolean 2"*/}
              {/*      name="hasWaterLevels"*/}
              {/*      onChange={handleFilterValues}*/}
              {/*      type="boolean"*/}
              {/*      value={filterValues?.hasWaterLevels?.value}*/}
              {/*    />*/}
              {/*    <Filter*/}
              {/*      label="Boolean 3"*/}
              {/*      name="hasWQData"*/}
              {/*      onChange={handleFilterValues}*/}
              {/*      type="boolean"*/}
              {/*      value={filterValues?.hasWQData?.value}*/}
              {/*    />*/}
              {/*    <Filter*/}
              {/*      label="Boolean 4"*/}
              {/*      name="isPermitted"*/}
              {/*      onChange={handleFilterValues}*/}
              {/*      type="boolean"*/}
              {/*      value={filterValues?.isPermitted?.value}*/}
              {/*    />*/}
              {/*    <Filter*/}
              {/*      label="Boolean 5"*/}
              {/*      name="isExempt"*/}
              {/*      onChange={handleFilterValues}*/}
              {/*      type="boolean"*/}
              {/*      value={filterValues?.isExempt?.value}*/}
              {/*    />*/}
              {/*    <Filter*/}
              {/*      label="Boolean 6"*/}
              {/*      name="isMonitoring"*/}
              {/*      onChange={handleFilterValues}*/}
              {/*      type="boolean"*/}
              {/*      value={filterValues?.isMonitoring?.value}*/}
              {/*    />*/}
              {/*  </Box>*/}
              {/*</FilterControl>*/}
            </FiltersContainer>
          </FiltersSection>
        )}

        <FiltersSection>
          <FiltersContainer>
            <FilterControl label={`Color Data Dots by ${activeStyle.name}`}>
              <Typography variant="subtitle1" gutterBottom>
                Color wells by
              </Typography>
              <WellStylesControl
                label="Color Data Dots by"
                name="wellStyles"
                onChange={handleActiveStyle}
                options={styleOptions}
                value={activeStyle.id}
              />
            </FilterControl>
          </FiltersContainer>
        </FiltersSection>

        <FiltersSection>
          <FiltersContainer>
            <>
              <SplitButton
                options={splitButtonOptions}
                handleExportClick={handleSplitButtonClick}
              />
              <PrintReportDialog
                downloadCallback={handlePrintMapClick}
                setPrintReportDialogOpen={setPrintReportDialogOpen}
                printReportDialogOpen={printReportDialogOpen}
                title={title}
                setTitle={setTitle}
              />
            </>
          </FiltersContainer>
        </FiltersSection>
      </FiltersBar>
      <Map ref={mapContainer}>
        {eventsRegistered && (
          <MainControl
            activeBasemap={activeBasemap}
            basemaps={basemaps}
            layers={layers}
            onBasemapChange={updateBasemap}
            onLayerChange={updateLayerVisibility}
            value={filterValues?.search?.value}
          />
        )}
        {process.env.NODE_ENV === "development" && (
          <ZoomInfo zoomLevel={zoomLevel} />
        )}
        {/*<DataVizControl*/}
        {/*  open={dataVizVisible}*/}
        {/*  onClose={() => setDataVizVisible(!dataVizVisible)}*/}
        {/*/>*/}
        {/*<DataViz*/}
        {/*  open={dataVizVisible}*/}
        {/*  dataVizWellNumber={dataVizWellNumber}*/}
        {/*  dataVizGraphType={dataVizGraphType}*/}
        {/*  onClose={() => setDataVizVisible(false)}*/}
        {/*/>*/}

        <MeasurementsPopup
          measurementsContainerRef={measurementsContainerRef}
          radiusRef={radiusRef}
          polygonRef={polygonRef}
          pointRef={pointRef}
          lineRef={lineRef}
          onHide={() => setMeasurementsVisible(false)}
          onClear={handleClearMeasurements}
        />

        {!measurementsVisible && (
          <MeasurementsControl
            open={measurementsVisible}
            onToggle={() => setMeasurementsVisible(!measurementsVisible)}
            right={49}
            bottom={30}
          />
        )}
      </Map>

      {eventsRegistered && printReportDialogOpen && (
        <span
          style={{
            display: "none",
            width: "100%",
          }}
        >
          <PrintMapFormat
            ref={printRef}
            title={title}
            mapImg={map.getCanvas().toDataURL("image/png")}
            map={map}
          />
        </span>
      )}
    </>
  );
};

export default PublicMap;
