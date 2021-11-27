const express = require('express');
const {checkAccessToken} = require('../../core/middleware/auth.js');
const {graph_wellproductions: model} = require('../../core/models');
const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

router.post('/:id', (req, res, next) => {
  const where = {};
  where.well_ndx = +req.params.id;

  model
    .findAll({where})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
