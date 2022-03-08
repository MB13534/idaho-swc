module.exports = {
  id: 'bell-parcels-symbol',
  name: 'Bell CAD Parcels',
  type: 'symbol',
  source: 'bell-parcels',
  'source-layer': 'parcels',
  paint: {
    'text-color': 'rgb(49,49,49)',
    'text-halo-color': 'rgba(255,255,255,1)',
    'text-halo-width': 3,
  },
  layout: {
    'text-field': ['get', 'PROP_ID'],
    'text-font': ['literal', ['Roboto Black', 'Arial Unicode MS Bold']],
    'text-size': 14,
    visibility: 'none',
  },
  minzoom: 16.5,
  lreProperties: {
    layerGroup: 'bell-parcels',
  },
};
