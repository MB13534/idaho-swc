module.exports = {
  id: 'extraterritorial-jurisdiction-symbol',
  name: 'Extraterritorial Jurisdiction',
  type: 'symbol',
  source: 'extraterritorial-jurisdiction',
  'source-layer': 'Extraterritorial_Jurisdiction-1fwi5b',
  paint: {
    // 'line-color': '#444',
    'text-color': 'hsl(73,100%,16%)',
    'text-halo-color': '#ffffff',
    'text-halo-width': 5,
  },
  layout: {
    'text-field': ['get', 'CITY_NAME'],
    'text-size': 14,
    visibility: 'none',
  },
  // minzoom: 12,
  lreProperties: {
    layerGroup: 'extraterritorial-jurisdiction',
  },
};
