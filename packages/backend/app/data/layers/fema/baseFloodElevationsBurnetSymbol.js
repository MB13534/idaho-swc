module.exports = {
  id: 'fema-base-flood-elevation-burnet-symbol',
  name: 'FEMA',
  type: 'symbol',
  source: 'fema-base-flood-elevation-burnet',
  'source-layer': 'FEMA_Burnet_S_BFE-4ws3y2',
  paint: {
    'text-color': '#0c2f4b',
    'text-halo-color': 'hsl(0, 11%, 98%)',
    'text-halo-width': 6,
  },
  layout: {
    'symbol-placement': 'line',
    'text-field': ['concat', ['to-string', ['get', 'ELEV']], ' ft'],
    'text-size': 14,
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'fema',
  },
};
