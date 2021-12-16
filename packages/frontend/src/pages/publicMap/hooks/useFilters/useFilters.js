import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

const layerId = "clearwater-wells-circle";
const initFilterValues = {
  aquifers: {
    layerId,
    layerFieldName: "source_aquifer",
    options: [],
    type: "multi-select",
    value: [],
  },
  primaryUses: {
    layerId,
    layerFieldName: "primary_use",
    options: [],
    type: "multi-select",
    value: [],
  },
  wellStatus: {
    layerId,
    layerFieldName: "well_status",
    options: [],
    type: "multi-select",
    value: [],
  },
  aggregatedSystems: {
    layerId,
    layerFieldName: "agg_system_name",
    options: [],
    type: "multi-select",
    value: [],
  },
  hasProduction: {
    layerId,
    layerFieldName: "has_production",
    type: "boolean",
    value: false,
  },
  hasWaterLevels: {
    layerId,
    layerFieldName: "has_waterlevels",
    type: "boolean",
    value: false,
  },
  hasWQData: {
    layerId,
    layerFieldName: "has_wqdata",
    type: "boolean",
    value: false,
  },
  isPermitted: {
    layerId,
    layerFieldName: "is_permitted",
    type: "boolean",
    value: false,
  },
  isExempt: {
    layerId,
    layerFieldName: "is_exempt",
    type: "boolean",
    value: true,
  },
  isMonitoring: {
    layerId,
    layerFieldName: "is_monitoring",
    type: "boolean",
    value: false,
  },
};

const useFilters = ({ onFilterChange }) => {
  const [filterValues, setFilterValues] = useState(initFilterValues);

  const { data } = useQuery(["filterData"], async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/api/public-map/filters`
      );
      return response;
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    setFilterValues((prevState) => ({
      ...prevState,
      aquifers: {
        ...prevState.aquifers,
        options: data?.data?.aquifers || [],
        value: data?.data?.aquifers.map(({ value }) => value) || [],
      },
      primaryUses: {
        ...prevState.primaryUses,
        options: data?.data?.primaryUses || [],
        value: data?.data?.primaryUses.map(({ value }) => value) || [],
      },
      wellStatus: {
        ...prevState.wellStatus,
        options: data?.data?.wellStatus || [],
        value: data?.data?.wellStatus.map(({ value }) => value) || [],
      },
      aggregatedSystems: {
        ...prevState.aggregatedSystems,
        options: data?.data?.aggregatedSystems || [],
        value: data?.data?.aggregatedSystems.map(({ value }) => value) || [],
      },
    }));
  }, [data?.data]);

  const handleSelectAll = (name) => {
    setFilterValues((prevState) => {
      const newState = {
        ...prevState,
        [name]: {
          ...prevState[name],
          value: data?.data?.[name]?.map(({ value }) => value),
        },
      };
      onFilterChange(newState);
      return newState;
    });
  };

  const handleSelectNone = (name) => {
    setFilterValues((prevState) => {
      const newState = {
        ...prevState,
        [name]: {
          ...prevState[name],
          value: [],
        },
      };
      onFilterChange(newState);
      return newState;
    });
  };

  const handleFilterValues = (event) => {
    const { checked, name, value } = event.target;

    const type = filterValues[name].type;

    if (type === "multi-select") {
      setFilterValues((prevState) => {
        const newValue = [...prevState[name].value];
        const existingIndex = newValue.indexOf(value);
        if (existingIndex > -1) {
          newValue.splice(existingIndex, 1);
        } else {
          newValue.push(value);
        }
        const newState = {
          ...prevState,
          [name]: {
            ...prevState[name],
            value: newValue,
          },
        };
        onFilterChange(newState);
        return newState;
      });
    } else if (type === "boolean") {
      setFilterValues((prevState) => {
        const newState = {
          ...prevState,
          [name]: {
            ...prevState[name],
            value: checked,
          },
        };
        onFilterChange(newState);
        return newState;
      });
    }
  };

  return {
    filterValues,
    handleFilterValues,
    handleSelectAll,
    handleSelectNone,
  };
};

export default useFilters;
