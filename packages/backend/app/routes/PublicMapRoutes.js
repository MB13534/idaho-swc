const express = require('express');
const {ui_list_wells: model} = require('../../core/models');

const router = express.Router();

const sources = [
  {
    id: 'clearwater-wells',
    type: 'geojson',
    data: [],
  },
];

const layers = [
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

router.get('/layers', (req, res, next) => {
  res.json(layers);
});

module.exports = router;
