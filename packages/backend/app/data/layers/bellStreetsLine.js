module.exports = {
  id: 'bell-streets-line',
  name: 'Bell CAD Streets',
  type: 'line',
  source: 'bell-streets',
  'source-layer': 'parcel_test',
  paint: {
    'line-color': '#444',
    'line-width': 2,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'bell-streets',
  },
};
