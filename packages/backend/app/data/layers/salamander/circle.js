module.exports = {
  id: 'salamander-circle',
  name: 'Salamander',
  type: 'circle',
  source: 'salamander',
  'source-layer': 'Salamander-1tblws',
  paint: {
    'circle-color': 'maroon',
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
