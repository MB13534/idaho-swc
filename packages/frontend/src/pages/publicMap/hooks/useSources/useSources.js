import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

// Fetch a list of sources to add to the map
const useSources = () => {
  const [sources, setSources] = useState([]);
  const { data, isError, isLoading } = useQuery(["Sources"], async () => {
    try {
      return await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/api/public-map/sources`
      );
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    setSources(data?.data || []);
  }, [data]);

  return { isError, isLoading, sources, setSources };
};

export default useSources;
