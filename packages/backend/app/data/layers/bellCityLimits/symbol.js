module.exports = {
  id: 'bell-city-limits-symbol',
  name: 'Bell CAD City Limits',
  type: 'symbol',
  source: 'bell-city-limits',
  'source-layer': 'Bell_CAD_City_Limits-141v43',
  paint: {
    // 'line-color': '#444',
    'text-color': 'hsl(265,100%,25%)',
    'text-halo-color': '#ffffff',
    'text-halo-width': 5,
  },
  layout: {
    'text-field': ['get', 'NAME'],
    'text-size': 14,
    visibility: 'none',
  },
  // minzoom: 16.5,
  lreProperties: {
    layerGroup: 'bell-city-limits',
  },
};
