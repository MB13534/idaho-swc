import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import { INIT_FILTER_VALUES } from "../../constants";

/**
 * Custom hook responsible for controlling the state related to the
 * Map filter controls
 * Accepts one argument, `onFilterChange` that is a callback that
 * can be run whenever a filter value changes
 */
const useFilters = ({ onFilterChange }) => {
  const [filterValues, setFilterValues] = useState(INIT_FILTER_VALUES);

  /**
   * Hit the API and get a list of options for each filter
   * The endpoint returns an object where each key/value pair
   * represents the options for a specific filter
   * This approach allows us to make a single API request instead
   * of multiple
   */
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

  /**
   * Set the options and initial value for each filter based on
   * what is returned from the DB
   */
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
      /*MJB hide aggregated system control per client (probably temporary)*/
      // aggregatedSystems: {
      //     ...prevState.aggregatedSystems,
      //     options: data?.data?.aggregatedSystems || [],
      //     value: data?.data?.aggregatedSystems.map(({ value }) => value) || [],
      //   },
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
    } else if (type === "select") {
      setFilterValues((prevState) => {
        const newState = {
          ...prevState,
          [name]: {
            ...prevState[name],
            value: value,
          },
        };
        // onFilterChange(newState);
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
