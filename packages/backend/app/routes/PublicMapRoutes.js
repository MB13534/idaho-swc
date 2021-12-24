const express = require('express');
const {
  ui_list_wells_table,
  list_aquifers,
  list_aggregate_systems,
} = require('../../core/models');
const sourceData = require('../data/sources');
const layersData = require('../data/layers');

const router = express.Router();

const sources = Object.values(sourceData);
const layers = Object.values(layersData);

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

router.get('/sources/wells', async (req, res, next) => {
  try {
    const wellsData = await ui_list_wells_table.findAll();
    res.json(wellsData);
  } catch (err) {
    next(err);
  }
});

router.get('/layers', (req, res, next) => {
  res.json(layers);
});

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
    const aggregatedSystems = await list_aggregate_systems
      .findAll({
        order: [['agg_system_name', 'asc']],
      })
      .map(({agg_system_name}) => ({
        display: agg_system_name,
        value: agg_system_name,
      }));
    res.json({
      aquifers: aquifers || [],
      primaryUses,
      wellStatus,
      aggregatedSystems:
        [...aggregatedSystems, {display: '--', value: '--'}] || [],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
