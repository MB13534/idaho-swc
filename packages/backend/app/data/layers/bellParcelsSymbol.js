module.exports = {
  id: 'bell-parcels-symbol',
  name: 'Bell CAD Parcels',
  type: 'symbol',
  source: 'bell-parcels',
  'source-layer': 'parcels',
  paint: {
    // 'line-color': '#444',
    'text-color': '#9a184e',
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
