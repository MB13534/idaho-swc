module.exports = {
  id: 'clearwater-wells-symbol',
  name: 'Clearwater Well Labels',
  type: 'symbol',
  source: 'clearwater-wells',
  drawOrder: -100,
  legendOrder: 99,
  layout: {
    'text-field': ['get', 'loc_name'],
    'text-size': 14,
    'text-offset': [0, -1.2],
    'text-font': ['literal', ['Roboto Black', 'Arial Unicode MS Bold']],
    visibility: 'none',
  },
  paint: {
    'text-color': 'rgb(49,49,49)',
    'text-halo-color': 'rgba(255,255,255,1)',
    'text-halo-width': 3,
  },
};
