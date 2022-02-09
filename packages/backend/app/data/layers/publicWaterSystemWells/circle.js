module.exports = {
  id: 'public-water-system-wells-circle',
  name: 'Public Water System Wells',
  type: 'circle',
  source: 'public-water-system-wells',
  'source-layer': 'PublicWaterSystem_Wells_TCEQ-7y2jxm',
  drawOrder: -1,
  paint: {
    'circle-color': 'hsla(240, 96%, 60%, 1)',
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
  lreProperties: {
    layerGroup: 'public-water-system-wells',
  },
};
