module.exports = {
  id: 'texas-groundwater-grid-fill',
  name: 'Texas Groundwater grid',
  type: 'fill',
  source: 'texas-groundwater-grid',
  'source-layer': 'TexasGrid_dd-12yijt',
  paint: {
    'fill-color': '#979191',
    'fill-opacity': 0,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'texas-groundwater-grid',
  },
};
