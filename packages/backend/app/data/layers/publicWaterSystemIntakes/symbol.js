module.exports = {
  id: 'public-water-system-intakes-symbol',
  name: 'Public Water System Intakes',
  type: 'symbol',
  source: 'public-water-system-intakes',
  'source-layer': 'PublicWaterSystem_SurfaceInta-0f7f3z',
  drawOrder: -1,
  layout: {
    'icon-image': 'za-provincial-2',
    'icon-size': [
      'interpolate',
      ['exponential', 1.16],
      ['zoom'],
      0, // min zoom level
      0.8, // icon size at min zoom
      22, // max zoom level
      1, // icon size at max zoom
    ],
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'public-water-system-intakes',
  },
};
