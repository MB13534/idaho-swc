module.exports = {
  id: 'huc-6-boundary-fill',
  name: 'HUC 6 Boundary',
  type: 'fill',
  source: 'huc-6-boundary',
  'source-layer': 'WBDHU6_UpperSnake-2sudt1',
  paint: {
    'fill-color': 'hsl(45,100%,57%)',
    'fill-opacity': 0,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'huc-6-boundary',
  },
};