import { useState } from "react";
import { scaleOrdinal } from "d3-scale";
import { schemePaired } from "d3-scale-chromatic";

const locationTypesValues = [
  "Stream Gage",
  "Sentinel Well",
  "Return Flow",
  "Reservoir",
  "Recharge",
  "Diversion",
  "Precipitation Station",
  "Stream Reach",
  "Diversion Pump",
  "Snotel",
  "Non-Sentinel Well",
];

const parameterNamesValues = [
  "Discharge",
  "Reach Gain",
  "SWE",
  'Soil Moisture (Avg % at 8")',
  "Depth to Water Level",
  "Gage Height",
  "Recharge",
  "Reservoir Contents",
  "Return Flow",
  "Total Precipitation",
  "Water Surface Elevation",
];

const dataProvidersValues = [
  "Agrimet",
  "BOR - Hydromet",
  "Calculation",
  "IDWR",
  "IDWR Accounting",
  "IDWR AquaInfo",
  "IDWR IWRB and IGWA",
  "NRCS Snotel",
  "USGS",
];

const buildScale = (values) => {
  const scale = scaleOrdinal(schemePaired);
  return values.reduce((acc, val) => {
    acc.push([val]);
    acc.push(scale(val));
    return acc;
  }, []);
};

const layerId = "data-dots-circle";
const styleValues = {
  default: {
    id: "default",
    layerId,
    layerFieldName: "",
    name: "Default",
    paint: {
      "circle-color": "#1e8dd2",
    },
  },
  locationTypes: {
    id: "locationTypes",
    layerId,
    layerFieldName: "loc_type_name",
    name: "Location Types",
    paint: {
      "circle-color": [
        "match",
        ["get", "loc_type_name"],
        ...buildScale(locationTypesValues),
        "#000000",
      ],
    },
  },
  parameterNames: {
    id: "parameterNames",
    layerId,
    layerFieldName: "parameter_name",
    name: "Parameter Names",
    paint: {
      "circle-color": [
        "match",
        ["get", "parameter_name"],
        ...buildScale(parameterNamesValues),
        "#000000",
      ],
    },
  },
  dataProviders: {
    id: "dataProviders",
    layerId,
    layerFieldName: "data_provider",
    name: "Data Providers",
    options: [],
    type: "multi-select",
    value: [],
    paint: {
      "circle-color": [
        "match",
        ["get", "data_provider"],
        ...buildScale(dataProvidersValues),
        "#000000",
      ],
    },
  },
};

const useLayerStyles = ({ onLayerStyleChange }) => {
  const [activeStyle, setActiveStyle] = useState(styleValues.default);
  const styleOptions = Object.entries(styleValues).map(([key, value]) => ({
    display: value.name,
    value: key,
  }));

  const handleActiveStyle = (name) => {
    setActiveStyle(styleValues[name]);
    onLayerStyleChange(styleValues[name]);
  };

  return {
    activeStyle,
    handleActiveStyle,
    styleOptions,
    styleValues,
  };
};

export default useLayerStyles;
