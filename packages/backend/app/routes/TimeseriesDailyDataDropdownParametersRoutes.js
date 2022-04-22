const express = require('express');
const {checkAccessToken} = require('../../core/middleware/auth.js');
const {
  timeseries_daily_data_dropdown_parameters: model,
} = require('../../core/models');
const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(
  checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUTH0_AUDIENCE)
);

router.get('/', (req, res, next) => {
  model
    .findAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
