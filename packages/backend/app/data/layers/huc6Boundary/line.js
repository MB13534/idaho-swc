module.exports = {
  id: 'huc-6-boundary-line',
  name: 'HUC 6 Boundary',
  type: 'line',
  source: 'huc-6-boundary',
  'source-layer': 'WBDHU6_UpperSnake-2sudt1',
  paint: {
    'line-color': 'hsl(45,100%,57%)',
    'line-width': 2,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'huc-6-boundary',
  },
};
