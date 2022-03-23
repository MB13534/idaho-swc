module.exports = {
  id: 'huc-10-boundaries-line',
  name: 'HUC 10 Boundaries',
  type: 'line',
  source: 'huc-10-boundaries',
  'source-layer': 'WBDHU10_UpperSnake-d8ek61',
  paint: {
    'line-color': '#34327C',
    'line-width': 3,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'huc-10-boundaries',
  },
  drawOrder: 98,
};
