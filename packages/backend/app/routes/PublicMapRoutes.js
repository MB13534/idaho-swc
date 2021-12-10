const express = require('express');
const {ui_list_wells: model, list_aquifers} = require('../../core/models');

const router = express.Router();

const sources = [
  {
    id: 'clearwater-wells',
    type: 'geojson',
    data: [],
  },
  {
    id: 'major-aquifers',
    type: 'vector',
    url: 'mapbox://txclearwater.1zpxkpma',
  },
  {
    id: 'fema-flood-hazard',
    type: 'vector',
    url: 'mapbox://txclearwater.0tvqpsja',
  },
  {
    id: 'ccn-water-gcs',
    type: 'vector',
    url: 'mapbox://txclearwater.8v5dou5d',
  },
];

const layers = [
  {
    id: 'major-aquifers-fill',
    name: 'Major Aquifers',
    type: 'fill',
    source: 'major-aquifers',
    'source-layer': 'Aquifers_major_dd-1n355v',
    paint: {
      'fill-opacity': 0.5,
      'fill-color': '#9AC0F9',
    },
    layout: {
      visibility: 'none',
    },
    lreProperties: {
      layerGroup: 'major-aquifers',
    },
  },
  {
    id: 'major-aquifers-line',
    name: 'Major Aquifers',
    type: 'line',
    source: 'major-aquifers',
    'source-layer': 'Aquifers_major_dd-1n355v',
    paint: {
      'line-color': '#444',
    },
    layout: {
      visibility: 'none',
    },
    lreProperties: {
      layerGroup: 'major-aquifers',
    },
  },
  {
    id: 'ccn-water-gcs-fill',
    name: 'CCN Water GCS',
    type: 'fill',
    source: 'ccn-water-gcs',
    'source-layer': 'CCN_WATER_GCS_PUC-7ukl7v',
    paint: {
      'fill-opacity': 0.5,
      'fill-color': '#ffff00',
    },
    layout: {
      visibility: 'none',
    },
    lreProperties: {
      layerGroup: 'ccn-water-gcs',
    },
  },
  {
    id: 'ccn-water-gcs-line',
    name: 'CCN Water GCS',
    type: 'line',
    source: 'ccn-water-gcs',
    'source-layer': 'CCN_WATER_GCS_PUC-7ukl7v',
    paint: {
      'line-color': '#444',
    },
    layout: {
      visibility: 'none',
    },
    lreProperties: {
      layerGroup: 'ccn-water-gcs',
    },
  },
  // {
  //   id: 'fema-flood-hazard-line',
  //   name: 'FEMA Flood Hazard',
  //   type: 'line',
  //   source: 'fema-flood-hazard',
  //   'source-layer': 'FEMA_Milam_S_FLD_HAZ_AR-ckbcnb',
  //   paint: {
  //     'line-color': '#444',
  //     'line-width': 12,
  //   },
  //   layout: {
  //     visibility: 'none',
  //   },
  // },
  {
    id: 'clearwater-wells-circle',
    name: 'Clearwater Wells',
    type: 'circle',
    source: 'clearwater-wells',
    paint: {
      'circle-color': '#4094ae',
      'circle-radius': 4,
    },
    layout: {
      visibility: 'visible',
    },
  },
];

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
      type: 'feature',
      geometry: d[geometryField],
      properties: (() => {
        const properties = {...d};
        delete d[geometryField];
        return properties;
      })(),
    })),
  };
};

router.get('/sources', async (req, res, next) => {
  try {
    const wellsData = await model.findAll();
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
    const wellsData = await model.findAll();
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
    res.json({
      aquifers: aquifers || [],
      primaryUses,
      wellStatus,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
