module.exports = {
  id: 'twdb-well-reports-circle',
  name: 'TWDB Well Reports',
  type: 'circle',
  source: 'twdb-well-reports',
  drawOrder: -1,
  'source-layer': 'parcels',
  paint: {
    'circle-color': '#d95f00',
    'circle-radius': [
      'interpolate',
      ['exponential', 1.16],
      ['zoom'],
      0, // min zoom level
      3, // circle radius at min zoom
      22, // max zoom level
      24, // circle radius at max zoom
    ],
    'circle-stroke-width': [
      'interpolate',
      ['exponential', 1.16],
      ['zoom'],
      0, // min zoom level
      1, // stroke width at min zoom
      22, // max zoom level
      4, // stroke width at max zoom
    ],
    'circle-stroke-color': '#fff',
  },
  layout: {
    visibility: 'none',
  },
};
