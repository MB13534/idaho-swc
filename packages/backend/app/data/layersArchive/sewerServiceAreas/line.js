module.exports = {
  id: 'sewer-service-areas-line',
  name: 'Sewer Service Areas',
  type: 'line',
  source: 'sewer-service-areas',
  'source-layer': 'CCN_SEWER_GCS_PUC-7mos8f',
  paint: {
    'line-color': '#9b6712',
    'line-width': 1,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'sewer-service-areas',
  },
};
