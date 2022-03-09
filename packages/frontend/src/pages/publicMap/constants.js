export const BASEMAP_STYLES = [
  {
    style: "outdoors-v11",
    name: "Outdoors",
    url: "mapbox://styles/mapbox/outdoors-v11",
  },
  {
    style: "streets-v11",
    name: "Streets",
    url: "mapbox://styles/mapbox/streets-v11",
  },
  {
    style: "satellite-streets-v11",
    name: "Satellite",
    url: "mapbox://styles/mapbox/satellite-streets-v11",
  },
  {
    style: "light-v10",
    name: "Light",
    url: "mapbox://styles/mapbox/light-v10",
  },
  {
    style: "dark-v10",
    name: "Dark",
    url: "mapbox://styles/mapbox/dark-v10",
  },
];

export const DEFAULT_MAP_CENTER = [-112.80227, 43.52744];

export const INIT_MAP_CONFIG = {
  style: BASEMAP_STYLES[0].url,
  center: DEFAULT_MAP_CENTER,
  zoom: 7,
  preserveDrawingBuffer: true,
};

export const WELLS_LAYER_ID = "data-dots-circle";
export const WELLS_LABELS_LAYER_ID = "data-dots-symbol";

export const INIT_FILTER_VALUES = {
  locationTypes: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "loc_type_name",
    options: [],
    type: "multi-select",
    value: [],
  },
  parameterNames: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "parameter_name",
    options: [],
    type: "multi-select",
    value: [],
  },
  dataProviders: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "data_provider",
    options: [],
    type: "multi-select",
    value: [],
  },

  hasProduction: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "has_production",
    type: "boolean",
    value: false,
  },
  hasWaterLevels: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "has_waterlevels",
    type: "boolean",
    value: false,
  },
  hasWQData: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "has_wqdata",
    type: "boolean",
    value: false,
  },
  isPermitted: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "is_permitted",
    type: "boolean",
    value: false,
  },
  //MJB setting isExempt default to false
  isExempt: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "is_exempt",
    type: "boolean",
    value: false,
  },
  isMonitoring: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "is_monitoring",
    type: "boolean",
    value: false,
  },

  search: {
    layerId: WELLS_LAYER_ID,
    type: "select",
    value: "attributes_search",
  },
};

export const WELLS_SEARCH_OPTIONS = [
  {
    value: "attributes_search",
    label: "Attributes",
  },
  {
    value: "comma_separated_data_dots_search",
    label: "Ids",
  },
];
