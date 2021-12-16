import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

// Fetch a list of layers to add to the map
const useLayers = () => {
  const [layers, setLayers] = useState([]);

  const { data, isError, isLoading } = useQuery(["Layers"], async () => {
    try {
      return await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/api/public-map/layers`
      );
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    setLayers(data?.data || []);
  }, [data]);

  return {
    isLoading,
    isError,
    layers,
    setLayers,
  };
};

export default useLayers;
