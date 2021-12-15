const express = require('express');
const {
  ui_list_wells_table,
  list_aquifers,
  list_aggregate_systems,
} = require('../../core/models');

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
      'fill-opacity': 0.75,
      'fill-color': [
        'match',
        ['get', 'AQ_NAME'],
        ['CARRIZO'],
        '#a6cee3',
        ['SEYMOUR'],
        '#1f78b4',
        ['TRINITY'],
        '#b2df8a',
        ['OGALLALA'],
        '#33a02c',
        ['PECOS VALLEY'],
        '#fb9a99',
        ['HUECO_BOLSON'],
        '#e31a1c',
        ['EDWARDS-TRINITY'],
        '#fdbf6f',
        ['EDWARDS'],
        '#cab2d6',
        ['GULF_COAST'],
        '#ff7f00',
        '#000000',
      ],
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
      'line-color': 'hsla(0, 3%, 25%, 0.56)',
      'line-width': 0.4,
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
  {
    id: 'clearwater-wells-circle',
    name: 'Clearwater Wells',
    type: 'circle',
    source: 'clearwater-wells',
    paint: {
      'circle-color': '#1e8dd2',
      'circle-radius': [
        'interpolate',
        ['exponential', 1.16],
        ['zoom'],
        0, // min zoom level
        3, // circle radius at min zoom
        22, // max zoom level
        24, // circle radius at max zoom
      ],
      'circle-stroke-width': [
        'interpolate',
        ['exponential', 1.16],
        ['zoom'],
        0, // min zoom level
        1, // stroke width at min zoom
        22, // max zoom level
        4, // stroke width at max zoom
      ],
      'circle-stroke-color': '#fff',
    },
    layout: {
      visibility: 'visible',
    },
    lreProperties: {
      popup: {
        titleField: 'cucwcd_well_number',
        excludeFields: [
          'well_ndx',
          'longitude_dd',
          'latitude_dd',
          'location_geometry',
          'has_production',
          'has_waterlevels',
          'has_wqdata',
          'count_waterlevels',
          'well_type',
          'count_',
          'id',
        ],
      },
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
