import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import Popup from "../../popup";
import useSources from "../useSources";
import useLayers from "../useLayers";
import { MapLogger } from "./mapUtils";
import { BASEMAP_STYLES } from "../../constants";
import debounce from "lodash.debounce";
import createTheme from "../../../../theme";
import { ThemeProvider } from "styled-components/macro";
import { useSelector } from "react-redux";
import {
  jssPreset,
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import { create } from "jss";
import DragCircleControl from "../../../../components/map/DragCircleControl";
import { RulerControl } from "mapbox-gl-controls";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as MapboxDrawGeodesic from "mapbox-gl-draw-geodesic";
import { handleCopyCoords, updateArea } from "../../../../utils/map";
import ResetZoomControl from "../../../../components/map/ResetZoomControl";
import { isTouchScreenDevice } from "../../../../utils";

const mapLogger = new MapLogger({
  enabled: process.env.NODE_ENV === "development",
  prefix: "Public Map",
});

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

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
  const theme = useSelector((state) => state.themeReducer);
  const [map, setMap] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [activeBasemap, setActiveBasemap] = useState(BASEMAP_STYLES[0].style);
  const [dataAdded, setDataAdded] = useState(false);
  const [dataVizVisible, setDataVizVisible] = useState(false);
  const [dataVizWellNumber, setDataVizWellNumber] = useState(null);
  const [dataVizGraphType, setDataVizGraphType] = useState(null);

  const [eventsRegistered, setEventsRegistered] = useState(false);
  const popUpRef = useRef(
    new mapboxgl.Popup({
      maxWidth: "375px",
      offset: 15,
      focusAfterOpen: false,
    })
  );
  const polygonRef = useRef(null);
  const radiusRef = useRef(null);
  const pointRef = useRef(null);
  const measurementsContainerRef = useRef(null);

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

      mapInstance?.on("load", () => {
        mapLogger.log("Map loaded");
        setMap(mapInstance);
      });
    }
    //MJB removed map from dependency array because it set an endless loop
  }, [ref, mapConfig]); //eslint-disable-line

  //MJB adding some logic to resize the map when the map container ref size changes
  //ResizeObserver watches for changes in bounding box for ref
  //debounce delays the resize function by 100ms
  useEffect(() => {
    if (map) {
      const resizer = new ResizeObserver(debounce(() => map.resize(), 100));
      resizer.observe(ref.current);
      return () => {
        resizer.disconnect();
      };
    }
  }, [map, ref]);

  /**
   * Function responsible for adding sources and layers to the map
   * There are a number of checks in place to ensure that sources
   * only get added to the map once the map and sources are loaded and
   * to ensure that layers are only added to the map once the layers are
   * loaded and the associated sources are added to the map
   */
  const loadMapData = useCallback(() => {
    const shouldAddData =
      !!map &&
      map?.loaded() &&
      sources?.length > 0 &&
      layers?.length > 0 &&
      !dataAdded;

    if (shouldAddData) {
      sources.forEach((source) => {
        const { id, ...rest } = source;
        const sourceExists = !!map.getSource(id);
        if (!sourceExists) {
          map.addSource(id, rest);
        }
      });

      mapLogger.log("Sources added to map");

      layers
        .sort((a, b) => ((a.drawOrder || 0) > (b.drawOrder || 0) ? -1 : 1))
        .forEach((layer) => {
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

  const addMapControls = useCallback(() => {
    const shouldAddControls = !!map;
    if (shouldAddControls) {
      //top left controls
      map.addControl(new mapboxgl.NavigationControl(), "top-left");
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          // When active the map will receive updates to the device's location as it changes.
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: true,
        }),
        "top-left"
      );
      map.addControl(new ResetZoomControl(), "top-left");

      //top right controls
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");

      //bottom left controls
      map.addControl(
        new mapboxgl.ScaleControl({ unit: "imperial", maxWidth: 250 }),
        "bottom-left"
      );
      map.addControl(
        new RulerControl({
          units: "feet",
          labelFormat: (n) => `${n.toFixed(2)} ft`,
        }),
        "bottom-left"
      );

      //adds control features as extended by MapboxDrawGeodesic (draw circle)
      let modes = MapboxDraw.modes;
      modes = MapboxDrawGeodesic.enable(modes);
      const draw = new MapboxDraw({
        modes,
        controls: {
          polygon: true,
          point: true,
          trash: true,
        },
        displayControlsDefault: false,
        userProperties: true,
      });

      //event listener to run function updateArea during each draw action to handle measurements popup
      const drawActions = ["draw.create", "draw.update", "draw.delete"];
      drawActions.forEach((item) => {
        map.on(item, (event) => {
          const geojson = event.features[0];
          const type = event.type;
          updateArea(
            geojson,
            type,
            polygonRef,
            radiusRef,
            pointRef,
            measurementsContainerRef,
            draw
          );
        });
      });

      //bottom right controls
      //draw controls do not work correctly on touch screens
      !isTouchScreenDevice() &&
        map.addControl(draw, "bottom-right") &&
        !isTouchScreenDevice() &&
        map.addControl(new DragCircleControl(draw), "bottom-right");
    }
  }, [map]);

  const addMapEvents = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      map?.on("zoom", () => {
        setZoomLevel(map?.getZoom());
      });
    }

    const shouldAddClickEvent = map && layers?.length > 0 && dataAdded;
    if (shouldAddClickEvent && !eventsRegistered) {
      //MJB add event listener for all circle and symbol layers
      // pointer on mouseover
      const cursorPointerLayerIds = layers
        .filter((layer) => ["circle", "symbol"].includes(layer.type))
        .map((layer) => layer.id);
      cursorPointerLayerIds.forEach((layerId) => {
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";

          map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "";
          });
        });
      });

      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point);

        //TODO add popup pagination
        // console.log(
        //   features.filter((item) => popupLayerIds.includes(item.layer.id))
        // );

        //Ensure that if the map is zoomed out such that multiple
        //copies of the feature are visible, the popup appears
        //over the copy being pointed to.
        //only for features with the properties.lat/long field (clearwater wells)
        const coordinates = features[0]?.properties?.latitude_dd
          ? [
              features[0].properties.longitude_dd,
              features[0].properties.latitude_dd,
            ]
          : [e.lngLat.lng, e.lngLat.lat];

        //MJB add check for popups so they only appear on our dynamic layers
        const popupLayerIds = layers.map((layer) => layer.id);
        if (
          features.length > 0 &&
          popupLayerIds.includes(features[0].layer.id)
        ) {
          const feature = features[0];
          // const popup = {};
          const popup = layers?.find(
            (layer) => layer?.id === feature?.layer?.id
          )?.lreProperties?.popup;
          // create popup node
          const popupNode = document.createElement("div");
          ReactDOM.render(
            //MJB adding style providers to the popup
            <StylesProvider jss={jss}>
              <MuiThemeProvider theme={createTheme(theme.currentTheme)}>
                <ThemeProvider theme={createTheme(theme.currentTheme)}>
                  <Popup
                    setDataVizVisible={setDataVizVisible}
                    setDataVizWellNumber={setDataVizWellNumber}
                    setDataVizGraphType={setDataVizGraphType}
                    excludeFields={popup?.excludeFields}
                    feature={feature}
                    titleField={popup?.titleField}
                  />
                </ThemeProvider>
              </MuiThemeProvider>
            </StylesProvider>,
            popupNode
          );
          popUpRef.current
            .setLngLat(coordinates)
            .setDOMContent(popupNode)
            .addTo(map);
        }
      });

      // //handles copying coordinates and measurements to the clipboard
      const copyableRefs = [polygonRef, radiusRef, pointRef];
      copyableRefs.forEach((ref) => {
        ref.current.addEventListener("click", (e) => {
          handleCopyCoords(e.target.textContent);
        });
      });

      setEventsRegistered(true);
      mapLogger.log("Event handlers attached to map");
    }
  }, [map, layers, dataAdded, eventsRegistered, theme.currentTheme]);

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
          //MJB only apply filter if toggle is true
          //MJB no filter applied if toggle is false
          if (filter.value) {
            mapFilterExpression.push([
              "==",
              ["get", filter.layerFieldName],
              filter.value,
            ]);
          }
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

  const updateBasemap = (style) => {
    map?.setStyle(style.url);

    /**
     * After the map style changes we need to poll it every
     * 100 ms to determine if the new map style has loaded
     * After it is loaded, we add any existing sources and layers
     * back to the map
     */
    const checkStyleLoaded = setInterval(() => {
      const styleLoaded = map?.isStyleLoaded();
      if (styleLoaded) {
        clearInterval(checkStyleLoaded);
        setActiveBasemap(style.style);
        setDataAdded(false);
        loadMapData();
      }
    }, 100);
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

  // add all map controls
  useEffect(() => {
    addMapControls();
  }, [addMapControls]);

  return {
    activeBasemap,
    basemaps: BASEMAP_STYLES,
    layers,
    map,
    sources,
    zoomLevel,
    updateBasemap,
    updateLayerFilters,
    updateLayerStyles,
    updateLayerVisibility,
    polygonRef,
    radiusRef,
    pointRef,
    measurementsContainerRef,
    dataVizVisible,
    setDataVizVisible,
    dataVizWellNumber,
    setDataVizWellNumber,
    dataVizGraphType,
    setDataVizGraphType,
    eventsRegistered,
  };
};

export { useMap };
