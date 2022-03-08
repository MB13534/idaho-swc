module.exports = {
  id: 'extraterritorial-jurisdiction-symbol',
  name: 'Extraterritorial Jurisdiction',
  type: 'symbol',
  source: 'extraterritorial-jurisdiction',
  'source-layer': 'Extraterritorial_Jurisdiction-1fwi5b',
  paint: {
    'text-color': 'rgb(49,49,49)',
    'text-halo-color': 'rgba(255,255,255,1)',
    'text-halo-width': 3,
  },
  layout: {
    'text-field': ['get', 'CITY_NAME'],
    'text-size': 14,
    'text-font': ['literal', ['Roboto Black', 'Arial Unicode MS Bold']],
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'extraterritorial-jurisdiction',
  },
};
