module.exports = {
  id: 'fema-flood-plains-bell-fill',
  name: 'FEMA',
  type: 'fill',
  source: 'fema-flood-plains-bell',
  'source-layer': 'FEMA_Bell_S_FLD_HAZ_AR-437w4k',
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
