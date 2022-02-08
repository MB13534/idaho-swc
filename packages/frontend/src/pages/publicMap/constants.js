export const BASEMAP_STYLES = [
  {
    style: "outdoors-v11",
    name: "Outdoors",
    url: "mapbox://styles/txclearwater/ckyj8pr0u1t3a15o7hn1np1l6",
  },
  {
    style: "streets-v11",
    name: "Streets",
    url: "mapbox://styles/txclearwater/ckyj8qlsm4el014mmsyu6tbt7",
  },
  {
    style: "satellite-streets-v11",
    name: "Satellite",
    url: "mapbox://styles/txclearwater/ckyj8r9413cw314ockxj5g5wp",
  },
  {
    style: "light-v10",
    name: "Light",
    url: "mapbox://styles/txclearwater/ckyj8rtgra5jo14o1gli8c9s1",
  },
  {
    style: "dark-v10",
    name: "Dark",
    url: "mapbox://styles/txclearwater/ckyj8t1h04en914mm98yqwkcg",
  },
];

export const DEFAULT_MAP_CENTER = [-97.47, 31.05];

export const INIT_MAP_CONFIG = {
  style: BASEMAP_STYLES[0].url,
  center: DEFAULT_MAP_CENTER,
  zoom: 11,
  preserveDrawingBuffer: true,
};

export const WELLS_LAYER_ID = "clearwater-wells-circle";
export const INIT_FILTER_VALUES = {
  aquifers: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "source_aquifer",
    options: [],
    type: "multi-select",
    value: [],
  },
  primaryUses: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "primary_use",
    options: [],
    type: "multi-select",
    value: [],
  },
  wellStatus: {
    layerId: WELLS_LAYER_ID,
    layerFieldName: "well_status",
    options: [],
    type: "multi-select",
    value: [],
  },
  /*MJB hide aggregated system control per client (probably temporary)*/
  // aggregatedSystems: {
  //   layerId: WELLS_LAYER_ID,
  //   layerFieldName: "agg_system_name",
  //   options: [],
  //   type: "multi-select",
  //   value: [],
  // },
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
    value: "comma_separated_wells_search",
    label: "Wells",
  },
];
