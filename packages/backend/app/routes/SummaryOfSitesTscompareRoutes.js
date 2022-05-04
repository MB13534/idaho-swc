const express = require('express');
const {summary_of_sites_tscompare: model} = require('../../core/models');
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
