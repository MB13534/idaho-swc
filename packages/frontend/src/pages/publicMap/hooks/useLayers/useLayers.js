import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { twentyFourHoursInMs } from "../../../../utils";

// Fetch a list of layers to add to the map
const useLayers = () => {
  const [layers, setLayers] = useState([]);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const { data, isError, isLoading } = useQuery(
    ["Layers"],
    async () => {
      let headers = {};
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        headers = { Authorization: `Bearer ${token}` };
      }
      try {
        return await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/public-map/layers`,
          { headers }
        );
      } catch (err) {
        console.error(err);
      }
    },
    {
      refetchOnWindowFocus: false,
      staleTime: twentyFourHoursInMs,
      cacheTime: twentyFourHoursInMs,
    }
  );

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
