module.exports = {
  id: 'huc-10-boundaries-fill',
  name: 'HUC 10 Boundaries',
  type: 'fill',
  source: 'huc-10-boundaries',
  'source-layer': 'WBDHU10_UpperSnake-d8ek61',
  paint: {
    'fill-color': '#34327C',
    'fill-opacity': 0,
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'huc-10-boundaries',
    popup: {
      titleField: 'Name',
      excludeFields: [
        'LoadDate',
        'OBJECTID',
        'Shape_Area',
        'Shape_Leng',
        'TNMID',
      ],
    },
  },
  drawOrder: 98,
};
