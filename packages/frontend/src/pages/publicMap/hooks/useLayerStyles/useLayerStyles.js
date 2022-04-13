import { useState } from "react";
import { scaleOrdinal } from "d3-scale";
import { scaleSequential } from "d3-scale";
import { interpolateRainbow } from "d3-scale-chromatic";

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
  "SNOTEL",
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

const huc8NamesValues = [
  "American Falls",
  "Beaver-Camas",
  "Big Lost",
  "Big Wood",
  "Blackfoot",
  "Idaho Falls",
  "Lake Walcott",
  "Little Lost",
  "Little Wood",
  "Lower Henrys",
  "Portneuf",
  "Raft",
  "Teton",
  "Upper Henrys",
  "Upper Snake-Rock",
  "Willow",
];

const huc10NamesValues = [
  "American Falls Reservoir",
  "Big Cottonwood Creek",
  "Birch Creek-Snake River",
  "Black Butte Hills-Big Wood River",
  "Black Ridge Crater",
  "Box Canyon",
  "Brigham Point-Snake River",
  "Calder Creek-Raft River",
  "Camas Creek",
  "Camp Holly Lake-Town of Rupert",
  "Cedar Butte",
  "City of Aberdeen",
  "City of Shelley-Snake River",
  "Crater Lake",
  "East Main Canal-Little Wood River",
  "Fish Creek",
  "Garden Creek-Marsh Creek",
  "Headwaters Camas Creek",
  "Headwaters Willow Creek",
  "Island Park Reservoir-Henrys Fork",
  "Kettle Butte",
  "Laidlaw Park",
  "Lanes Creek-Diamond Creek",
  "Little Fish Creek-Little Wood River",
  "Lower Blackfoot River",
  "Lower Fall River",
  "Lower Little Lost River",
  "Lower Portneuf River",
  "Lyons Creek-Snake River",
  "Massacre Rocks-Snake River",
  "Middle Big Lost River",
  "Middle Portneuf River",
  "Milner Dam-Snake River",
  "Muldoon Creek",
  "North Fork Big Lost River",
  "Outlet Willow Creek",
  "Pleasant Valley-Lake Channel Canyon",
  "Rising River-Watson Slough",
  "Rock Creek",
  "Ross Fork",
  "Sand Creek",
  "Sand Creek-Henrys Fork",
  "South Teton River-Teton River",
  "Star Hope Creek",
  "Teton Basin-Teton River",
  "Town of Springfield-Danielson Creek",
  "Trail Creek-Teton River",
  "Twin Falls Main Canal-Snake River",
  "Upper Bannock Creek",
  "Upper Blackfoot River",
  "Wet Creek",
];

const colors = (specifier) => {
  var n = (specifier.length / 6) | 0,
    colors = new Array(n),
    i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
};

const colorsString20 =
  "1F77B4AEC7E8FF7F0EFFBB782CA02C98DF8AD62728FF98969467BDC5B0D58C564BC49C94E377C2F7B6D27F7F7FC7C7C7BCBD22DBDB8D17BECF9EDAE5";

const buildScale = (values) => {
  const scale =
    values.length <= 20
      ? scaleOrdinal(colors(colorsString20))
      : scaleSequential(interpolateRainbow);

  const degree = 100 / values.length / 100;

  return values.reduce((acc, val, i) => {
    acc.push([val]);

    if (values.length <= 20) {
      acc.push(scale(val));
    } else {
      acc.push(scale(i * degree));
    }

    return acc;
  }, []);
};

const layerId = "data-points-circle";
export const styleValues = {
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
  huc8Names: {
    id: "huc8Names",
    layerId,
    layerFieldName: "huc8_name",
    name: "HUC8 Names",
    options: [],
    type: "multi-select",
    value: [],
    paint: {
      "circle-color": [
        "match",
        ["get", "huc8_name"],
        ...buildScale(huc8NamesValues),
        "#000000",
      ],
    },
  },
  huc10Names: {
    id: "huc10Names",
    layerId,
    layerFieldName: "huc10_name",
    name: "HUC10 Names",
    options: [],
    type: "multi-select",
    value: [],
    paint: {
      "circle-color": [
        "match",
        ["get", "huc10_name"],
        ...buildScale(huc10NamesValues),
        "#000000",
      ],
    },
  },
  default: {
    id: "default",
    layerId,
    layerFieldName: "",
    name: "Default",
    paint: {
      "circle-color": "#1e8dd2",
    },
  },
};

const useLayerStyles = ({ onLayerStyleChange }) => {
  const [activeStyle, setActiveStyle] = useState(styleValues.locationTypes);
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
