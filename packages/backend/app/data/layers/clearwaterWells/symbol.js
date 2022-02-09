module.exports = {
  id: 'clearwater-wells-symbol',
  name: 'Clearwater Well Labels',
  type: 'symbol',
  source: 'clearwater-wells',
  // minzoom: 12,
  layout: {
    'text-field': ['get', 'cuwcd_well_number'],
    'text-size': 14,
    'text-offset': [0, -1.2],
    visibility: 'none',
  },
  paint: {
    'text-color': '#000000',
    'text-halo-color': '#ffffff',
    'text-halo-width': 5,
  },
};
