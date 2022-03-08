module.exports = {
  id: 'bell-streets-line',
  name: 'Bell CAD Streets',
  type: 'line',
  source: 'bell-streets',
  'source-layer': 'parcel_test',
  paint: {
    'line-color': '#8D8D8D',
    'line-width': 2,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'bell-streets',
  },
};
