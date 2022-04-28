module.exports = {
  id: 'huc-6-boundary-fill',
  name: 'HUC 6 Boundary',
  type: 'fill',
  source: 'huc-6-boundary',
  'source-layer': 'WBDHU6_UpperSnake-2sudt1',
  paint: {
    'fill-color': '#1E812B',
    'fill-opacity': 0,
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
