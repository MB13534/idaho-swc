module.exports = {
  id: 'fema-base-flood-elevation-milam-symbol',
  name: 'FEMA',
  type: 'symbol',
  source: 'fema-base-flood-elevation-milam',
  'source-layer': 'FEMA_Milam_S_BFE-2wkgfk',
  paint: {
    'text-color': '#0c2f4b',
    'text-halo-color': 'hsl(0, 11%, 98%)',
    'text-halo-width': 6,
  },
  layout: {
    'symbol-placement': 'line',
    'text-field': ['concat', ['to-string', ['get', 'ELEV']], ' ft'],
    'text-size': 14,
    visibility: 'visible',
  },
  lreProperties: {
    layerGroup: 'fema',
  },
};
