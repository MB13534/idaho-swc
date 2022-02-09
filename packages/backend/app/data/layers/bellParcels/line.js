module.exports = {
  id: 'bell-parcels-line',
  name: 'Bell CAD Parcels',
  type: 'line',
  source: 'bell-parcels',
  'source-layer': 'parcels',
  paint: {
    'line-color': '#ffe119',
    'line-width': 3,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'bell-parcels',
  },
};
