module.exports = {
  id: 'sewer-service-areas-fill',
  name: 'Sewer Service Areas',
  type: 'fill',
  source: 'sewer-service-areas',
  'source-layer': 'CCN_SEWER_GCS_PUC-7mos8f',
  paint: {
    'fill-color': 'hsla(37, 88%, 45%, 0.18)',
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'sewer-service-areas',
  },
};
