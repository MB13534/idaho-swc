module.exports = {
  id: 'huc-12-boundaries-fill',
  name: 'HUC 12 Boundaries',
  type: 'fill',
  source: 'huc-12-boundaries',
  'source-layer': 'WBDHU12_UpperSnake-1w0nan',
  paint: {
    'fill-color': 'hsl(0,100%,27%)',
    'fill-opacity': 0,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'huc-12-boundaries',
  },
};
