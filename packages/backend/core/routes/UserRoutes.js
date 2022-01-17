const express = require('express');
const {checkAccessToken, checkPermission} = require('../middleware/auth.js');
const {users: model} = require('../models');
const {buildCoreCrudRoutes} = require('../routes/crud/handlers');

const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(
  checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUTH0_AUDIENCE)
);
router.use(checkPermission(['read:users', 'write:users']));

const options = {};

buildCoreCrudRoutes(router, model, options);

module.exports = router;
