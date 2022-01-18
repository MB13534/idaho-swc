const express = require('express');
const {checkAccessToken} = require('../../core/middleware/auth.js');
const {dm_wqs: model} = require('../../core/models');
const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(
  checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUTH0_AUDIENCE)
);

const spaceToNullProperties = [
  'ph',
  'conductivity',
  'tds',
  'salinity',
  'alkalinity',
  'hardness',
  'nitrite',
  'nitrate',
  'phosphate',
  'sulfate',
  'fluoride',
];

const spaceToNull = (req) => {
  for (const key in req) {
    if (req[key] === '' && spaceToNullProperties.includes(key)) {
      req[key] = null;
    }
  }
};

router.post('/:id', (req, res, next) => {
  const where = {};
  where.cuwcd_well_number = req.params.id;
  model
    .findAll({where})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  spaceToNull(req.body);
  model
    .create(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  spaceToNull(req.body);
  model
    .update(req.body, {
      where: {
        ndx: req.params.id,
      },
      returning: true,
    })
    .then((data) => {
      res.json(data[1][0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  model
    .destroy({
      where: {
        ndx: req.params.id,
      },
      returning: true,
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
