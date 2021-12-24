module.exports = {
  id: 'bell-parcels-line',
  name: 'Bell CAD Parcels',
  type: 'line',
  source: 'bell-parcels',
  'source-layer': 'parcels',
  paint: {
    'line-color': '#9a184e',
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'bell-parcels',
  },
};
