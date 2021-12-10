import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

const initFilterValues = {
  aquifers: {
    layerId: "clearwater-wells-circle",
    layerFieldName: "source_aquifer",
    options: [],
    value: [],
  },
  primaryUses: {
    layerId: "clearwater-wells-circle",
    layerFieldName: "primary_use",
    options: [],
    value: [],
  },
  wellStatus: {
    layerId: "clearwater-wells-circle",
    layerFieldName: "well_status",
    options: [],
    value: [],
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
    const { name, value } = event.target;
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
  };

  return {
    filterValues,
    handleFilterValues,
    handleSelectAll,
    handleSelectNone,
  };
};

export default useFilters;
