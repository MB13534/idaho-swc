module.exports = {
  id: 'huc-8-boundaries-line',
  name: 'HUC 8 Boundaries',
  type: 'line',
  source: 'huc-8-boundaries',
  'source-layer': 'WBDHU08_UpperSnake-6vc1aa',
  paint: {
    'line-color': '#60BAF0',
    'line-width': 6,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'huc-8-boundaries',
  },
  drawOrder: 99,
};
