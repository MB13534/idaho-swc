module.exports = {
  id: 'huc-12-boundaries-line',
  name: 'HUC 12 Boundaries',
  type: 'line',
  source: 'huc-12-boundaries',
  'source-layer': 'WBDHU12_UpperSnake-1w0nan',
  paint: {
    'line-color': '#D12881',
    'line-width': 1,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'huc-12-boundaries',
  },
  drawOrder: 97,
};
