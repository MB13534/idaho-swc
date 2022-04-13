module.exports = {
  id: 'data-points-circle',
  name: 'Data Points',
  type: 'circle',
  source: 'data-points',
  drawOrder: -100,
  legendOrder: 100,
  paint: {
    'circle-color': '#1e8dd2',
    // 'circle-radius': [
    //   'interpolate',
    //   ['exponential', 1.16],
    //   ['zoom'],
    //   0, // min zoom level
    //   3, // circle radius at min zoom
    //   22, // max zoom level
    //   24, // circle radius at max zoom
    // ],
    'circle-radius': 8,
    // 'circle-stroke-width': [
    //   'interpolate',
    //   ['exponential', 1.16],
    //   ['zoom'],
    //   0, // min zoom level
    //   1, // stroke width at min zoom
    //   22, // max zoom level
    //   4, // stroke width at max zoom
    // ],
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
  layout: {
    visibility: 'visible',
  },
  lreProperties: {
    popup: {
      titleField: 'loc_name',
      excludeFields: [],
    },
  },
};
