const express = require('express');
const {
  timeseries_daily_data_dropdown_parameters: model,
} = require('../../core/models');
const router = express.Router();

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
