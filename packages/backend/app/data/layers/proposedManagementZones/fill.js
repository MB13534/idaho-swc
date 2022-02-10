module.exports = {
  id: 'proposed-management-zones-fill',
  name: '🔒 Proposed Management Zones',
  type: 'fill',
  source: 'proposed-management-zones',
  'source-layer': 'Proposed_Management_Zones-bd97ag',
  paint: {
    'fill-color': 'hsla(83, 89%, 57%, 0.14)',
  },
  layout: {
    visibility: 'none',
  },
  lreProperties: {
    layerGroup: 'proposed-management-zones',
    permissions: {
      roles: ['Administrator', 'Developer'],
    },
  },
};
