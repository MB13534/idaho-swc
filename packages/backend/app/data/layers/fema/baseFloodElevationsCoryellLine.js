module.exports = {
  id: 'fema-base-flood-elevation-coryell-line',
  name: 'FEMA',
  type: 'line',
  source: 'fema-base-flood-elevation-coryell',
  'source-layer': 'FEMA_Coryell_S_BFE-8n07in',
  paint: {
    'line-color': '#444',
    'line-width': 2,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'fema',
  },
};
