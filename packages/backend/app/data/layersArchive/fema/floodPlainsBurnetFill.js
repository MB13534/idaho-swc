module.exports = {
  id: 'fema-flood-plains-burnet-fill',
  name: 'FEMA',
  type: 'fill',
  source: 'fema-flood-plains-burnet',
  'source-layer': 'FEMA_Burnet_S_FLD_HAZ_AR-3e8lmp',
  paint: {
    'fill-color': 'hsla(217, 80%, 70%, 0.38)',
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'fema',
  },
};
