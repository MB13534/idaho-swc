module.exports = {
  id: 'fema-flood-plains-coryell-fill',
  name: 'FEMA',
  type: 'fill',
  source: 'fema-flood-plains-coryell',
  'source-layer': 'FEMA_Coryell_S_FLD_HAZ_AR-cvs69q',
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
