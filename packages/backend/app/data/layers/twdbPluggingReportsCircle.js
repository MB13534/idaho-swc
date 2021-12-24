module.exports = {
  id: 'twdb-plugging-reports-circle',
  name: 'TWDB Plugging Reports',
  type: 'circle',
  source: 'twdb-plugging-reports',
  'source-layer': 'parcels',
  paint: {
    'circle-color': '#fb4444',
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
