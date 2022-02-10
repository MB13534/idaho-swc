module.exports = {
  id: 'clearwater-wells-circle',
  name: 'Clearwater Wells',
  type: 'circle',
  source: 'clearwater-wells',
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
      titleField: 'cucwcd_well_number',
      excludeFields: [
        'well_ndx',
        'longitude_dd',
        'latitude_dd',
        'location_geometry',
        'has_production',
        'has_waterlevels',
        'has_wqdata',
        'well_type',
        'count_',
        'id',
      ],
    },
  },
};
