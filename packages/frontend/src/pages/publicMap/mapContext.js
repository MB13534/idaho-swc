import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { useQuery } from "react-query";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapContext = React.createContext();

const useMap = (ref, mapConfig) => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error(`useMap must be used within a MapProvider`);
  }

  const { layers, map, mapStatus, setMap, setMapStatus, sources } = context;

  useEffect(() => {
    if (ref?.current && !mapStatus.map.created) {
      const newMap = new mapboxgl.Map({
        container: ref.current,
        ...mapConfig,
      });
      // setMapStatus((s) => ({
      //   ...s,
      //   map: {
      //     ...s.map,
      //     created: true,
      //   },
      // }));
      newMap.on("load", () => {
        setMap(newMap);
        setMapStatus((s) => ({
          ...s,
          map: {
            ...s.map,
            created: true,
            loaded: true,
          },
        }));
      });
    }
  }, [ref, mapConfig, mapStatus.map.created, setMap, setMapStatus]);

  const loadMapData = useCallback(() => {
    if (mapStatus.map.loaded && !mapStatus.sources.added) {
      sources.forEach((source) => {
        const cleanedSource = { ...source };
        delete cleanedSource.id;
        map.addSource(source.id, cleanedSource);
      });

      if (!mapStatus.layers.added) {
        layers.forEach((layer) => {
          map.addLayer(layer);
        });
      }

      setMapStatus((prevState) => ({
        ...prevState,
        sources: {
          loaded: true,
          added: true,
        },
        layers: {
          loaded: true,
          added: true,
        },
      }));
    }
  }, [
    layers,
    map,
    mapStatus.map.loaded,
    mapStatus.sources.added,
    mapStatus.layers.added,
    setMapStatus,
    sources,
  ]);

  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  return {
    layers,
    map,
    mapStatus,
    sources,
  };
};

const MapProvider = (props) => {
  const [map, setMap] = useState(null);
  const [mapStatus, setMapStatus] = useState({
    map: {
      created: false,
      loaded: false,
    },
    sources: {
      loaded: false,
      added: false,
    },
    layers: {
      loaded: false,
      added: false,
    },
  });
  const {
    data: sources,
    isLoading: sourcesLoading,
    error: sourcesError,
  } = useQuery(["Sources"], async () => {
    try {
      return await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/api/public-map/sources`
      );
    } catch (err) {
      console.error(err);
    }
  });
  const {
    data: layers,
    isLoading: layersLoading,
    error: layersError,
  } = useQuery(["Layers"], async () => {
    try {
      return await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/api/public-map/layers`
      );
    } catch (err) {
      console.error(err);
    }
  });

  const value = React.useMemo(
    () => ({
      layers: layers?.data || [],
      map,
      mapStatus,
      setMap,
      setMapStatus,
      sources: sources?.data || [],
    }),
    [layers, map, mapStatus, setMap, setMapStatus, sources]
  );
  return <MapContext.Provider value={value} {...props} />;
};

export { MapProvider, useMap };
