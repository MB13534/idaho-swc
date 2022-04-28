module.exports = {
  id: 'huc-12-boundaries-fill',
  name: 'HUC 12 Boundaries',
  type: 'fill',
  source: 'huc-12-boundaries',
  'source-layer': 'WBDHU12_UpperSnake-1w0nan',
  paint: {
    'fill-color': '#D12881',
    'fill-opacity': 0,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'huc-12-boundaries',
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
  drawOrder: 97,
};
