import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import { useQuery } from "react-query";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import Popup from "./popup";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapContext = React.createContext();

/**
 * The `useMap` hook controls all of the Mapbox functionality. It controls
 * everything from rendering the map and popups to filtering layers to styling
 * layers.
 * The hook exposes the map instance in addition to a variety of handlers
 * responsible for applying filters and styles to the map
 * @param {object} ref a React ref for the map container
 * @param {*} mapConfig initial configuration options for the map
 * see https://docs.mapbox.com/mapbox-gl-js/api/map/
 */
const useMap = (ref, mapConfig) => {
  const context = useContext(MapContext);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  if (!context) {
    throw new Error(`useMap must be used within a MapProvider`);
  }

  const { layers, map, mapStatus, setLayers, setMap, setMapStatus, sources } =
    context;

  /**
   * Function responsible for initializing the map
   * Once the map is loaded, store a reference to the map in
   * our application state and update the map status
   */
  const initializeMap = useCallback(() => {
    if (ref?.current && !mapStatus.map.created && layers) {
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

      newMap.on("click", (e) => {
        const features = newMap.queryRenderedFeatures(e.point, {
          layers: ["clearwater-wells-circle"],
        });
        if (features.length > 0) {
          const feature = features[0];
          const { popup } = layers.find(
            ({ id }) => id === feature?.layer?.id
          )?.lreProperties;
          // create popup node
          const popupNode = document.createElement("div");
          ReactDOM.render(
            <Popup
              excludeFields={popup?.excludeFields}
              feature={feature}
              titleField={popup?.titleField}
            />,
            popupNode
          );
          popUpRef.current
            .setLngLat(e.lngLat)
            .setDOMContent(popupNode)
            .addTo(newMap);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, mapStatus.map.created, layers]);

  /**
   * Function responsible for adding sources and layers to the map
   * There are a number of checks in place to ensure that sources
   * only get added to the map once the map and sources are loaded and
   * to ensure that layers are only added to the map once the layers are
   * loaded and the associated sources are added to the map
   */
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
        const { lreProperties, ...rest } = layer;
        const layerExists = map.getLayer(layer.id);
        if (!layerExists) map.addLayer(rest);
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

  /**
   * Handler used to apply user's filter values to the map instance
   * We rely on the `setFilter` method available on the map instance
   * and Mapbox expressions to apply filters to the wells layer
   * This function translates the filter values into valid
   * Mapbox expressions
   * Mapbox expressions are gnarly, powerful black box.
   * See https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/
   * The easiest way to get a feel for expressions is to create a new map
   * in Mapbox Studio, add a map layer, apply some filters to the layer and
   * then click on the code icon in the sidebar drawer to inspect the
   * Mapbox expression that is generated for the applied filters
   * (ask Ben Tyler if this doesn't make sense)
   * @param {object} filterValues object representing all of the current
   * filter values
   */
  const updateLayerFilters = (filterValues) => {
    if (!!map) {
      /**
       * Setting to all means that all conditions must be met
       * Equivalent to and in SQL, change to "any" for the or
       * equivalent
       */
      const mapFilterExpression = ["all"];
      Object.values(filterValues).forEach((filter) => {
        if (filter.type === "multi-select") {
          mapFilterExpression.push([
            "match",
            ["get", filter.layerFieldName],
            [...filter.value],
            true,
            false,
          ]);
        } else if (filter.type === "boolean") {
          mapFilterExpression.push([
            "==",
            ["get", filter.layerFieldName],
            filter.value,
          ]);
        }
      });
      map.setFilter("clearwater-wells-circle", mapFilterExpression);
    }
  };

  /**
   * Handler used to update paint styles applied to map layer
   * This is used to support the color wells by x control
   * We look through each provided paint style property and apply the
   * style rule to the layer
   * Reference https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setpaintproperty
   * @param {object} layer object representing a map layer
   */
  const updateLayerStyles = (layer) => {
    if (!!map) {
      Object.entries(layer.paint).forEach(([ruleName, ruleValue]) => {
        map.setPaintProperty(layer.layerId, ruleName, ruleValue);
      });
    }
  };

  /**
   * Handler used to update the visibility property on a layer
   * We employ special logic in this handler to allow for toggling
   * the visibility of grouped layers on and off
   * This allows us to display a single item in the layers list
   * but to control the visibility of multiple map layers at once
   * A common use case would be for something like parcels where
   * you want to display a layer for the parcel outlines and a layer
   * for the parcel fill.
   * This approach allows us to only show one layer in
   * the layer control list but to turn both layers on/off
   * @param {string | number} options.id ID associated with the layer or layer group
   * @param {boolean} options.boolean whether the layer is on/off
   */
  const updateLayerVisibility = ({ id, visible }) => {
    /**
     * Get a list of the IDs for the layers that need to have their
     * visibility updated
     * The ID that is passed to the handler will either be the ID for
     * the layer or an ID for a layer group
     */
    const groupedLayerIds = layers
      ?.filter((layer) => {
        const key = layer?.lreProperties?.layerGroup || layer.id;
        return key === id;
      })
      .map(({ id }) => id);

    if (!!map) {
      /**
       * Loop through all of the layers and update the visibility
       * for all of the layers associated with the layer toggled
       * in the layer control
       */
      const updatedLayers = layers.map((layer) => {
        if (!!map.getLayer(layer.id) && groupedLayerIds.includes(layer.id)) {
          const visibleValue = visible ? "visible" : "none";
          map.setLayoutProperty(layer.id, "visibility", visibleValue);
          return {
            ...layer,
            layout: {
              ...layer?.layout,
              visibility: visibleValue,
            },
          };
        }
        return layer;
      });
      setLayers(updatedLayers);
    }
  };

  // initialize and load the map
  useEffect(() => {
    initializeMap();
    // cleanup function to remove map on unmount
    return () => map?.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeMap]);

  // add all the sources and layers to the map
  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  return {
    layers,
    map,
    mapStatus,
    sources,
    updateLayerFilters,
    updateLayerStyles,
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

  // Fetch a list of sources to add to the map
  const { data: sourcesData } = useQuery(["Sources"], async () => {
    try {
      return await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/api/public-map/sources`
      );
    } catch (err) {
      console.error(err);
    }
  });

  // Fetch a list of layers to add to the map
  const { data: layersData } = useQuery(["Layers"], async () => {
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
