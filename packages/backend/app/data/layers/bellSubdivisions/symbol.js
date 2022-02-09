module.exports = {
  id: 'bell-subdivisions-symbol',
  name: 'Bell CAD Subdivisions',
  type: 'symbol',
  source: 'bell-subdivisions',
  'source-layer': 'Bell_CAD_Subdivisions-3vq1qd',
  paint: {
    // 'line-color': '#444',
    'text-color': '#008088',
    'text-halo-color': '#ffffff',
    'text-halo-width': 5,
  },
  layout: {
    'text-field': ['get', 'SUBDIVISIO'],
    'text-size': 14,
    visibility: 'none',
  },
  // minzoom: 16.5,
  lreProperties: {
    layerGroup: 'bell-subdivisions',
  },
};
