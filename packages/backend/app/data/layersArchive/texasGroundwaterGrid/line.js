module.exports = {
  id: 'texas-groundwater-grid-line',
  name: 'Texas Groundwater grid',
  type: 'line',
  source: 'texas-groundwater-grid',
  'source-layer': 'TexasGrid_dd-12yijt',
  paint: {
    'line-color': '#979191',
    'line-width': 1,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'texas-groundwater-grid',
  },
};
