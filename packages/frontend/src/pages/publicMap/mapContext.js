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

  const {
    layers,
    map,
    mapStatus,
    setLayers,
    setMap,
    setMapStatus,
    setSources,
    sources,
  } = context;

  const initializeMap = useCallback(() => {
    if (ref?.current && !mapStatus.map.created) {
      const newMap = new mapboxgl.Map({
        container: ref.current,
        ...mapConfig,
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, mapStatus.map.created]);

  const loadMapData = useCallback(() => {
    const shouldAddData =
      map && mapStatus.map.loaded && sources?.length > 0 && layers?.length > 0;

    if (shouldAddData) {
      sources.forEach((source) => {
        const { id, ...rest } = source;
        const sourceExists = !!map.getSource(id);
        if (!sourceExists) map.addSource(id, rest);
      });

      layers.forEach((layer) => {
        const layerExists = map.getLayer(layer.id);
        if (!layerExists) map.addLayer(layer);
      });

      setMapStatus((prevState) => ({
        ...prevState,
        layers: {
          added: true,
          loaded: true,
        },
        sources: {
          added: true,
          loaded: true,
        },
      }));
    }
  }, [layers, map, mapStatus.map.loaded, setMapStatus, sources]);

  const updateLayerVisibility = ({ id, visible }) => {
    if (!!map && !!map.getLayer(id)) {
      const visibleValue = visible ? "visible" : "none";
      map.setLayoutProperty(id, "visibility", visibleValue);
      setLayers((prevState) => {
        return prevState.map((layer) => {
          if (layer.id === id) {
            return {
              ...layer,
              layout: {
                ...layer.layout,
                visibility: visibleValue,
              },
            };
          }
          return layer;
        });
      });
    }
  };

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  return {
    layers,
    map,
    mapStatus,
    sources,
    updateLayerVisibility,
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
    data: sourcesData,
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
    data: layersData,
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
  const [sources, setSources] = useState([]);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    setSources(sourcesData?.data || []);
  }, [sourcesData]);

  useEffect(() => {
    setLayers(layersData?.data || []);
  }, [layersData]);

  const value = React.useMemo(
    () => ({
      layers,
      map,
      mapStatus,
      setLayers,
      setMap,
      setMapStatus,
      setSources,
      sources,
    }),
    [layers, map, mapStatus, setMap, setMapStatus, sources]
  );
  return <MapContext.Provider value={value} {...props} />;
};

export { MapProvider, useMap };
