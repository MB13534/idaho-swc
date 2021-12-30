export const INIT_MAP_CONFIG = {
  style: "mapbox://styles/mapbox/outdoors-v11",
  center: [-97.47, 31.05],
  zoom: 11,
};

//MJB options for layer toggle buttons
export const DUMMY_BASEMAP_LAYERS = [
  { url: "streets-v11", icon: "commute" },
  { url: "outdoors-v11", icon: "park" },
  { url: "satellite-streets-v11", icon: "satellite_alt" },
];

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
};
