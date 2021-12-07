const express = require('express');
const {checkAccessToken} = require('../../core/middleware/auth.js');
const {
  list_permit_types: model,
  content_node_statuses,
} = require('../../core/models');
const {buildAppCrudRoutes} = require('../../core/routes/crud/handlers');

const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

const options = {
  findOptions: {
    include: [
      {
        model: content_node_statuses,
        as: 'content_node_statuses',
        required: false,
      },
      {
        model: model,
        as: 'versions',
        required: false,
      },
      {
        model: model,
        as: 'parent',
        required: false,
      },
    ],

    order: [[{model: model, as: 'versions'}, 'created_at', 'desc']],
  },
};

buildAppCrudRoutes(router, model, options);

module.exports = router;
