module.exports = {
  id: 'twdb-groundwater-wells-circle',
  name: 'TWDB Groundwater Wells',
  type: 'circle',
  source: 'twdb-groundwater-wells',
  drawOrder: -1,
  'source-layer': 'parcels',
  paint: {
    'circle-color': '#756fb4',
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
