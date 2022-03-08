module.exports = {
  id: 'fema-base-flood-elevation-milam-line',
  name: 'FEMA',
  type: 'line',
  source: 'fema-base-flood-elevation-milam',
  'source-layer': 'FEMA_Milam_S_BFE-2wkgfk',
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
