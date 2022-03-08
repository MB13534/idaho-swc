module.exports = {
  id: 'fema-base-flood-elevation-coryell-symbol',
  name: 'FEMA',
  type: 'symbol',
  source: 'fema-base-flood-elevation-coryell',
  'source-layer': 'FEMA_Coryell_S_BFE-8n07in',
  paint: {
    'text-color': 'rgb(49,49,49)',
    'text-halo-color': 'rgba(255,255,255,1)',
    'text-halo-width': 6,
  },
  layout: {
    'symbol-placement': 'line',
    'text-field': ['concat', ['to-string', ['get', 'ELEV']], ' ft'],
    'text-size': 14,
    'text-font': ['literal', ['Roboto Black', 'Arial Unicode MS Bold']],

    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'fema',
  },
};
