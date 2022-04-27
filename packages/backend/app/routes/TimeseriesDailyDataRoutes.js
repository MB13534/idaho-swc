const express = require('express');
const {timeseries_daily_data: model} = require('../../core/models');
const {Op} = require('sequelize');
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

router.get('/:parameter/:locations/:startDate/:endDate', (req, res, next) => {
  model
    .findAll({
      where: {
        parameter_ndx: req.params.parameter,
        loc_ndx: {
          [Op.in]: req.params.locations.split(','),
        },
        rdate: {
          [Op.between]: [req.params.startDate, req.params.endDate],
        },
      },
      order: [['rdate', 'desc']],
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
