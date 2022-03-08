module.exports = {
  id: 'springs-symbol',
  name: 'Springs',
  type: 'symbol',
  source: 'springs',
  'source-layer': 'Springs-8ng3rn',
  drawOrder: -1,
  layout: {
    'icon-image': 'rectangle-blue-2',
    'icon-allow-overlap': true,
    // 'icon-size': [
    //   'interpolate',
    //   ['exponential', 1.16],
    //   ['zoom'],
    //   0, // min zoom level
    //   0.8, // icon size at min zoom
    //   22, // max zoom level
    //   1, // icon size at max zoom
    // ],
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'springs',
  },
};
