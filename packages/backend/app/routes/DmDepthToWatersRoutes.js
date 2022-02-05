const express = require('express');
const {checkAccessToken} = require('../../core/middleware/auth.js');
const {dm_depth_to_waters: model} = require('../../core/models');
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

router.post('/:ndx', (req, res, next) => {
  const where = {};
  where.ndx = req.params.ndx;
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
  model
    .create(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/:ndx', (req, res, next) => {
  model
    .update(req.body, {
      where: {
        ndx: req.params.ndx,
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

router.delete('/:ndx', (req, res, next) => {
  model
    .destroy({
      where: {
        ndx: req.params.ndx,
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
