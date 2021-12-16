import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import Popup from "../../popup";
import useSources from "../useSources";
import useLayers from "../useLayers";
import { MapLogger } from "./mapUtils";

const mapLogger = new MapLogger({
  enabled: process.env.NODE_ENV === "development",
  prefix: "Public Map",
});

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

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
  const [map, setMap] = useState(null);
  const [dataAdded, setDataAdded] = useState(false);
  const [eventsRegistered, setEventsRegistered] = useState(false);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  // Fetch a list of sources  and layers to add to the map
  const { sources } = useSources();
  const { layers, setLayers } = useLayers();

  /**
   * Function responsible for initializing the map
   * Once the map is loaded, store a reference to the map in
   * our application state and update the map status
   */
  const initializeMap = useCallback(() => {
    if (ref?.current && !map?.loaded()) {
      const mapInstance = new mapboxgl.Map({
        container: ref.current,
        ...mapConfig,
      });

      const nav = new mapboxgl.NavigationControl();
      mapInstance.addControl(nav, "top-right");

      mapInstance.on("load", () => {
        setMap(mapInstance);
        mapLogger.log("Map loaded");
      });
    }
  }, [ref, mapConfig, map]);

  /**
   * Function responsible for adding sources and layers to the map
   * There are a number of checks in place to ensure that sources
   * only get added to the map once the map and sources are loaded and
   * to ensure that layers are only added to the map once the layers are
   * loaded and the associated sources are added to the map
   */
  const loadMapData = useCallback(() => {
    const shouldAddData =
      map?.loaded() && sources?.length > 0 && layers?.length > 0 && !dataAdded;

    if (shouldAddData) {
      sources.forEach((source) => {
        const { id, ...rest } = source;
        const sourceExists = !!map.getSource(id);
        if (!sourceExists) {
          map.addSource(id, rest);
        }
      });

      mapLogger.log("Sources added to map");

      layers.forEach((layer) => {
        const { lreProperties, ...rest } = layer;
        const layerExists = map.getLayer(layer.id);
        if (!layerExists) {
          map.addLayer(rest);
        }
      });

      mapLogger.log("Layers added to map");

      setDataAdded(true);
    }
  }, [dataAdded, layers, map, sources]);

  const addMapEvents = useCallback(() => {
    const shouldAddClickEvent = map && layers?.length > 0 && dataAdded;

    if (shouldAddClickEvent && !eventsRegistered) {
      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
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
            .addTo(map);
        }
      });
      setEventsRegistered(true);
      mapLogger.log("Event handlers attached to map");
    }
  }, [map, layers, dataAdded, eventsRegistered]);

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
      mapLogger.log("Filters updated on the clearwater-wells-circle layer");
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
      setLayers((prevState) => {
        return prevState.map((d) => {
          if (d.id !== layer.layerId) return d;
          return {
            ...d,
            paint: {
              ...d.paint,
              ...layer.paint,
            },
          };
        });
      });
      mapLogger.log(
        "Paint styles updated on the clearwater-wells-circle layer"
      );
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
      mapLogger.log(
        `Visibility set to ${visible ? "visible" : "none"} for the ${id} layer`
      );
    }
  };

  // initialize and render the map
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  // add all the sources and layers to the map
  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  // wire up all map related events
  useEffect(() => {
    addMapEvents();
  }, [addMapEvents]);

  return {
    layers,
    map,
    sources,
    updateLayerFilters,
    updateLayerStyles,
    updateLayerVisibility,
  };
};

export { useMap };
