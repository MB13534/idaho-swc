module.exports = {
  id: 'data-points-symbol',
  name: 'Data Points Labels',
  type: 'symbol',
  source: 'data-points',
  drawOrder: -100,
  legendOrder: 99,
  layout: {
    'text-field': ['get', 'loc_name'],
    'text-size': 14,
    'text-offset': [0, -1.2],
    'text-font': ['literal', ['Roboto Black', 'Arial Unicode MS Bold']],
    visibility: 'visible',
  },
  paint: {
    'text-color': 'rgb(49,49,49)',
    'text-halo-color': 'rgba(255,255,255,1)',
    'text-halo-width': 3,
  },
  lreProperties: {
    popup: {
      titleField: 'loc_name',
      excludeFields: [
        'loc_ndx',
        'loc_type_ndx',
        'loc_id',
        'num_days',
        'num_years',
        'location_geometry',
      ],
    },
  },
};
