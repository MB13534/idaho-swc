const express = require('express');
const {checkAccessToken, checkRoles} = require('../../core/middleware/auth.js');
const {
  ui_list_wells_table,
  list_aquifers,
  /*MJB hide aggregated system control per client (probably temporary)*/
  // list_aggregate_systems,
} = require('../../core/models');
const sourceData = require('../data/sources');
const layersData = require('../data/layers');

const router = express.Router();

/**
 * Utility for converting the object structure returned from the
 * require-dir package (see data/layers/index.js) into an array
 * of objects
 * @param {object} layers
 * @returns {array} returns an array of layer config objects
 */
const unnestLayers = (layerConfigs) =>
  Object.values(layerConfigs).flatMap((config) => {
    return Object.values(config);
  });

const sources = Object.values(sourceData);
const layers = unnestLayers(layersData);

/**
 * Utility used to clean a provide map layer
 * This is currently used to sanitize the `lreProperties` key on a layer config
 * so that we do not send the permissions associated with a layer to the frontend
 * @param {object} layer layer configuration object
 * @returns {object} returns a layer config minus sensitive info like permissions
 */
const cleanLayer = (layer) => {
  const {lreProperties, ...layerConfig} = layer;
  const {permissions, ...otherLreProperties} = lreProperties || {};
  return {
    ...layerConfig,
    lreProperties: {
      ...otherLreProperties,
    },
  };
};

// TODO move to DB and key off of index instead
const wellUsesData = [
  'Ag/Irrigation',
  'Domestic',
  'Industrial',
  'Livestock/Poultry',
  'Monitoring',
  'Not Used',
  'Other',
  'Public Supply',
  'Testing',
];

// TODO move to DB and key off of index instead
const wellStatusesData = [
  'Abandoned',
  'Active',
  'Capped',
  'Inactive',
  'Never Drilled',
  'Plugged',
  'Proposed',
  'Unknown',
];

/**
 * Utility used to build up valid geojson from provided json
 * @param {array} options.data Array of objects representing data that is being
 * converted to geojson
 * @param {string} options.geometryField the name of the field in the data source
 * that contains the geometry (i.e. coordinates) for a feature
 * @returns {array} returns a valid geojson object
 */
const toGeoJSON = ({data, geometryField}) => {
  return {
    type: 'FeatureCollection',
    features: data.map((d) => ({
      type: 'Feature',
      geometry: d[geometryField],
      properties: (() => {
        const properties = {...d};
        delete d[geometryField];
        return properties;
      })(),
    })),
  };
};

// TODO look at creating indexes for fields that are filtered on in wells data source
/**
 * Route used to pull back a list of all spatial data sources for the map
 * These records represent what gets added to the map through the Mapbox
 * `map.addSource()` method
 * Most of the sources are just plain old source style specifications with the
 * exception of the clearwater wells data source which is fetched from the DB
 * and then converted to valid geojson
 */
router.get('/sources', async (req, res, next) => {
  try {
    const wellsData = await ui_list_wells_table.findAll();
    const finalSources = sources.map((source) => {
      if (source.id === 'clearwater-wells') {
        return {
          ...source,
          data: toGeoJSON({
            data: wellsData.map(({dataValues}) => dataValues),
            geometryField: 'location_geometry',
          }),
        };
      }
      return source;
    });
    res.json(finalSources);
  } catch (err) {
    next(err);
  }
});

/**
 * Route used to return a list of all map layers
 * Passed to the Mapbox `addLayer` method on the frontend
 * We loop through each layer and check if there are permissions defined
 * in the lreProperties key.
 * If a role(s) is specified for a layer we check to make sure that the layer
 * is only returned if the requesting user belongs to the specified role
 */
router.get(
  '/layers',
  checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUTH0_AUDIENCE, false),
  (req, res, next) => {
    const filteredLayers = layers.reduce((layersAccumulator, layer) => {
      const layerRoles = layer?.lreProperties?.permissions?.roles;

      // remove sensitive info like permissions from the layer before returning it
      const cleanedLayer = cleanLayer(layer);

      if (!!layerRoles) {
        const hasRole = checkRoles(req.user, layerRoles);
        if (hasRole) layersAccumulator.push(cleanedLayer);
      } else {
        layersAccumulator.push(cleanedLayer);
      }
      return layersAccumulator;
    }, []);
    res.json(filteredLayers);
  }
);

/**
 * Route used to return a list of all the clearwater wells
 */
router.get('/wells', async (req, res, next) => {
  try {
    const wellsData = await ui_list_wells_table.findAll();
    res.json(wellsData);
  } catch (err) {
    next(err);
  }
});

/**
 * Route used to return a list of values used to populate the filter
 * controls on the public map
 * The route returns an object with a key for each filter where the associated
 * value represents the options to display in the filter control
 * Done this way so we only have to make one request to the API to request the
 * filter control options instead of a request for each filter
 */
router.get('/filters', async (req, res, next) => {
  try {
    const aquifers = await list_aquifers
      .findAll({
        order: [['aquifer_name', 'ASC']],
      })
      .map(({aquifer_name}) => ({display: aquifer_name, value: aquifer_name}));
    const primaryUses = wellUsesData.map((use) => ({display: use, value: use}));
    const wellStatus = wellStatusesData.map((use) => ({
      display: use,
      value: use,
    }));
    /*MJB hide aggregated system control per client (probably temporary)*/
    // const aggregatedSystems = await list_aggregate_systems
    //   .findAll({
    //     order: [['agg_system_name', 'asc']],
    //   })
    //   .map(({agg_system_name}) => ({
    //     display: agg_system_name,
    //     value: agg_system_name,
    //   }));
    res.json({
      aquifers: aquifers || [],
      primaryUses,
      wellStatus,
      /*MJB hide aggregated system control per client (probably temporary)*/
      // aggregatedSystems:
      //   [...aggregatedSystems, {display: '--', value: '--'}] || [],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
