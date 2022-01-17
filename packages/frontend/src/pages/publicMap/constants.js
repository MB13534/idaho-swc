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
    name: "dark",
    url: "mapbox://styles/txclearwater/ckyj8t1h04en914mm98yqwkcg",
  },
];

export const INIT_MAP_CONFIG = {
  style: BASEMAP_STYLES[0].url,
  center: [-97.47, 31.05],
  zoom: 11,
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
};
