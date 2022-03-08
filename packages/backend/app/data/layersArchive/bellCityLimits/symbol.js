module.exports = {
  id: 'bell-city-limits-symbol',
  name: 'Bell CAD City Limits',
  type: 'symbol',
  source: 'bell-city-limits',
  'source-layer': 'Bell_CAD_City_Limits-141v43',
  paint: {
    // 'line-color': '#444',
    'text-color': 'rgb(49,49,49)',
    'text-halo-color': 'rgba(255,255,255,1)',
    'text-halo-width': 3,
  },
  layout: {
    'text-field': ['get', 'NAME'],
    'text-size': 14,
    'text-font': ['literal', ['Roboto Black', 'Arial Unicode MS Bold']],
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'bell-city-limits',
  },
};
