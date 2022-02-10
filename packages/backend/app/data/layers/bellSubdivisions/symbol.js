module.exports = {
  id: 'bell-subdivisions-symbol',
  name: 'Bell CAD Subdivisions',
  type: 'symbol',
  source: 'bell-subdivisions',
  'source-layer': 'Bell_CAD_Subdivisions-3vq1qd',
  paint: {
    'text-color': 'rgb(49,49,49)',
    'text-halo-color': 'rgba(255,255,255,1)',
    'text-halo-width': 3,
  },
  layout: {
    'text-field': ['get', 'SUBDIVISIO'],
    'text-size': 14,
    'text-font': ['literal', ['Roboto Black', 'Arial Unicode MS Bold']],

    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'bell-subdivisions',
  },
};
