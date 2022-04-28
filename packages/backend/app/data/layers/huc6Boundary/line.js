module.exports = {
  id: 'huc-6-boundary-line',
  name: 'HUC 6 Boundary',
  type: 'line',
  source: 'huc-6-boundary',
  'source-layer': 'WBDHU6_UpperSnake-2sudt1',
  paint: {
    'line-color': '#1E812B',
    'line-width': 10,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'huc-6-boundary',
    popup: {
      titleField: 'Name',
      excludeFields: [
        'GNIS_ID',
        'LoadDate',
        'Shape_Area',
        'Shape_Leng',
        'TNMID',
      ],
    },
  },
  drawOrder: 100,
};
