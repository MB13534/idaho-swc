module.exports = {
  id: 'fema-base-flood-elevation-bell-symbol',
  name: 'FEMA',
  type: 'symbol',
  source: 'fema-base-flood-elevation-bell',
  'source-layer': 'FEMA_Bell_S_BFE-3gheia',
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
