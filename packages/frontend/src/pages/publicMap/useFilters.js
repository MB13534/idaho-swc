import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

const initFilterValues = {
  aquifers: ["Alluvium"],
};

const useFilters = ({ onFilterChange }) => {
  const [filterValues, setFilterValues] = useState(initFilterValues);

  const { data: aquifers } = useQuery(["aquifers"], async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/api/public-map/aquifers`
      );
      return response;
    } catch (err) {
      console.error(err);
    }
  });

  const handleSelectAll = (name) => {
    setFilterValues((prevState) => {
      const newState = {
        ...prevState,
        [name]: aquifers?.data.map(({ aquifer_name }) => aquifer_name),
      };
      onFilterChange({
        layerId: "clearwater-wells-circle",
        filterName: "source_aquifer",
        filterValue: newState[name],
      });
      return newState;
    });
  };

  const handleSelectNone = (name) => {
    setFilterValues((prevState) => {
      const newState = {
        ...prevState,
        [name]: [],
      };
      onFilterChange({
        layerId: "clearwater-wells-circle",
        filterName: "source_aquifer",
        filterValue: newState[name],
      });
      return newState;
    });
  };

  const handleFilterValues = (event) => {
    const { name, value } = event.target;
    setFilterValues((prevState) => {
      const newValue = [...prevState[name]];
      const existingIndex = newValue.indexOf(value);
      if (existingIndex > -1) {
        newValue.splice(existingIndex, 1);
      } else {
        newValue.push(value);
      }
      const newState = {
        ...prevState,
        [name]: newValue,
      };
      onFilterChange({
        layerId: "clearwater-wells-circle",
        filterName: "source_aquifer",
        filterValue: newState[name],
      });
      return newState;
    });
  };

  return {
    aquifers: aquifers?.data,
    filterValues,
    handleFilterValues,
    handleSelectAll,
    handleSelectNone,
  };
};

export default useFilters;
