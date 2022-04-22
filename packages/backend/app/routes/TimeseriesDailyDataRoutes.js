const express = require('express');
const {checkAccessToken} = require('../../core/middleware/auth.js');
const {timeseries_daily_data: model} = require('../../core/models');
const {Op} = require('sequelize');
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
