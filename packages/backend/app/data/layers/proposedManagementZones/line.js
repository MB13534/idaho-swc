module.exports = {
  id: 'proposed-management-zones-line',
  name: 'Proposed Management Zones',
  type: 'line',
  source: 'proposed-management-zones',
  'source-layer': 'Proposed_Management_Zones-bd97ag',
  paint: {
    'line-color': '#87a225',
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
