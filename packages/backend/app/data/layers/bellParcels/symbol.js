module.exports = {
  id: 'bell-parcels-symbol',
  name: 'Bell CAD Parcels',
  type: 'symbol',
  source: 'bell-parcels',
  'source-layer': 'parcels',
  paint: {
    // 'line-color': '#444',
    'text-color': '#857000',
    'text-halo-color': '#ffffff',
    'text-halo-width': 5,
  },
  layout: {
    'text-field': ['get', 'PROP_ID'],
    'text-size': 14,
    visibility: 'none',
  },
  minzoom: 16.5,
  lreProperties: {
    layerGroup: 'bell-parcels',
  },
};
