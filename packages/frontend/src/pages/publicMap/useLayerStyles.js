import { useState } from "react";
import { scaleOrdinal } from "d3-scale";
import { schemePaired } from "d3-scale-chromatic";

const aquiferValues = [
  "Middle Trinity",
  "Pecan",
  "Alluvium",
  "Lower Trinity",
  "Edwards (BFZ)",
  "Edwards Equivalent",
  "Ozan",
  "Upper Trinity",
  "Austin Chalk",
  "Lake Waco",
  "Kemp",
  "Undeclared",
  "Buda",
];

const primaryUseValues = [
  "Other",
  "Industrial",
  "Ag/Irrigation",
  "Testing",
  "Livestock/Poultry",
  "Domestic",
  "Not Used",
  "Public Supply",
  "Monitoring",
];

const wellStatusValues = [
  "Abandoned",
  "Unknown",
  "Plugged",
  "Proposed",
  "Never Drilled",
  "Capped",
  "Active",
  "Inactive",
];

const wellTypeValues = [
  "permitted",
  "exempt-permitted",
  "exempt",
  "monitoring",
  "exempt-monitoring",
  "monitoring-permitted",
  "other",
];

const buildScale = (values) => {
  const scale = scaleOrdinal(schemePaired);
  return values.reduce((acc, val) => {
    acc.push([val]);
    acc.push(scale(val));
    return acc;
  }, []);
};

const layerId = "clearwater-wells-circle";
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
  aquifers: {
    id: "aquifers",
    layerId,
    layerFieldName: "source_aquifer",
    name: "Aquifers",
    paint: {
      "circle-color": [
        "match",
        ["get", "source_aquifer"],
        ...buildScale(aquiferValues),
        "#000000",
      ],
    },
  },
  primaryUses: {
    id: "primaryUses",
    layerId,
    layerFieldName: "primary_use",
    name: "Primary Uses",
    options: [],
    type: "multi-select",
    value: [],
    paint: {
      "circle-color": [
        "match",
        ["get", "primary_use"],
        ...buildScale(primaryUseValues),
        "#000000",
      ],
    },
  },
  wellStatus: {
    id: "wellStatus",
    layerId,
    layerFieldName: "well_status",
    name: "Well Status",
    options: [],
    type: "multi-select",
    value: [],
    paint: {
      "circle-color": [
        "match",
        ["get", "well_status"],
        ...buildScale(wellStatusValues),
        "#000000",
      ],
    },
  },
  wellType: {
    id: "wellType",
    layerId,
    layerFieldName: "agg_system_name",
    name: "Well Type",
    options: [],
    type: "multi-select",
    value: [],
    paint: {
      "circle-color": [
        "match",
        ["get", "well_type"],
        ...buildScale(wellTypeValues),
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
