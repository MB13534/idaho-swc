const {v4: uuidv4} = require('uuid');

const sanitizeBody = (body) => {
  delete body.created_at;
  delete body.created_by;
  delete body.updated_at;
  delete body.updated_by;
  // delete body.deleted_at;
  // delete body.deleted_by;
  return body;
};

const CONTENT_NODE_STATUS_IDS = {
  DRAFT: '1',
  PUBLISHED: '2',
  UPDATED: '3',
};

const findAll = (model, options) => {
  return (req, res, next) => {
    model
      .findAll({where: {parent_id: null}, ...options})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  };
};

const findOne = (model, options) => {
  return (req, res, next) => {
    model
      .findOne({where: {id: req.params.id}, ...options})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  };
};

const findFuture = (model, options) => {
  return (req, res, next) => {
    model
      .findOne({
        where: {former_parent_id: req.params.id},
        paranoid: false,
        ...options,
      })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  };
};

const create = (model) => {
  return (req, res, next) => {
    const body = sanitizeBody(req.body);
    body.id = uuidv4();
    body.created_by = req.user[`${process.env.AUTH0_AUDIENCE}/appuser`].id;
    body.updated_by = req.user[`${process.env.AUTH0_AUDIENCE}/appuser`].id;
    model
      .create(body)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  };
};

const createVersion = (model) => {
  return (req, res, next) => {
    const body = req.body;
    body.id = uuidv4();
    model
      .create(body, {silent: true})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  };
};

// TODO: dkulak: secure this
const update = (model, options) => {
  return (req, res, next) => {
    const body = sanitizeBody(req.body);
    body.updated_by = req.user[`${process.env.AUTH0_AUDIENCE}/appuser`].id;
    model
      .update(body, {
        where: {id: req.params.id},
        returning: true,
        ...options,
      })
      .then((data) => {
        const updatedRecord = data[1][0];
        res.json(updatedRecord);
      })
      .catch((err) => {
        next(err);
      });
  };
};

const updateAll = (model, options) => {
  return (req, res, next) => {
    const attributes = sanitizeBody(req.body.attributes);
    const where = req.body.where;

    model
      .update(
        attributes,
        {where},
        {
          returning: true,
          ...options,
        }
      )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  };
};

// TODO: dkulak: secure this
const remove = (model) => {
  return (req, res, next) => {
    const body = sanitizeBody(req.body);
    body.deleted_by = req.user[`${process.env.AUTH0_AUDIENCE}/appuser`].id;

    model
      .update(body, {
        where: {id: req.params.id},
        returning: true,
        silent: true,
      })
      .then(() => {
        model
          .destroy({
            where: {id: req.params.id},
          })
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };
};

const publish = (model) => {
  return (req, res, next) => {
    const userId = req.user[`${process.env.AUTH0_AUDIENCE}/appuser`].id;
    model
      .findByPk(req.params.id)
      .then((record) => {
        if (record) {
          record
            .update(
              {
                status_id:
                  record.status_id < CONTENT_NODE_STATUS_IDS.PUBLISHED
                    ? CONTENT_NODE_STATUS_IDS.PUBLISHED
                    : record.status_id,
                updated_by: userId,
              },
              {returning: true}
            )
            .then((data) => {
              res.json(data);
            })
            .catch((err) => {
              next(err);
            });
        } else {
          next(new Error('ID not found.'));
        }
      })
      .catch((err) => {
        next(err);
      });
  };
};

const unpublish = (model) => {
  return (req, res, next) => {
    const userId = req.user[`${process.env.AUTH0_AUDIENCE}/appuser`].id;
    model
      .findByPk(req.params.id)
      .then((record) => {
        if (record) {
          record
            .update(
              {status_id: CONTENT_NODE_STATUS_IDS.DRAFT, updated_by: userId},
              {returning: true}
            )
            .then((data) => {
              res.json(data);
            })
            .catch((err) => {
              next(err);
            });
        } else {
          next(new Error('ID not found.'));
        }
      })
      .catch((err) => {
        next(err);
      });
  };
};

// const undo = (model, options) => {
//   return (req, res, next) => {
//     const body = sanitizeBody(req.body);
//     body.updated_by = req.user[`${process.env.AUTH0_AUDIENCE}/appuser`].id;
//     model
//       .update(body, {
//         where: {id: req.params.id},
//         returning: true,
//         ...options,
//       })
//       .then((data) => {
//         const updatedRecord = data[1][0];
//         res.json(updatedRecord);
//       })
//       .catch((err) => {
//         next(err);
//       });
//   };
// };

const enable = (model) => {
  return (req, res, next) => {
    const userId = req.user[`${process.env.AUTH0_AUDIENCE}/appuser`].id;
    model
      .findByPk(req.params.id)
      .then((record) => {
        if (record) {
          record
            .update({active: true, updated_by: userId}, {returning: true})
            .then((data) => {
              res.json(data);
            })
            .catch((err) => {
              next(err);
            });
        } else {
          next(new Error('ID not found.'));
        }
      })
      .catch((err) => {
        next(err);
      });
  };
};

const disable = (model) => {
  return (req, res, next) => {
    const userId = req.user[`${process.env.AUTH0_AUDIENCE}/appuser`].id;
    model
      .findByPk(req.params.id)
      .then((record) => {
        if (record) {
          record
            .update({active: false, updated_by: userId}, {returning: true})
            .then((data) => {
              res.json(data);
            })
            .catch((err) => {
              next(err);
            });
        } else {
          next(new Error('ID not found.'));
        }
      })
      .catch((err) => {
        next(err);
      });
  };
};

const buildCoreCrudRoutes = (router, model, options) => {
  router.get('/', findAll(model, options.findOptions));
  router.get('/:id', findOne(model, options.findOptions));
  router.post('/', create(model));
  router.put('/', updateAll(model, {silent: true}));
  router.put('/:id', update(model));
  router.put('/:id/silent', update(model, {silent: true}));
  router.delete('/:id', remove(model));
  router.get('/:id/enable', publish(model));
  router.get('/:id/disable', unpublish(model));
  router.get('/:id/future', findFuture(model));
};

const buildAppCrudRoutes = (router, model, options) => {
  router.get('/', findAll(model, options.findOptions));
  router.get('/:id', findOne(model, options.findOptions));
  router.post('/', create(model));
  router.post('/version', createVersion(model));
  router.put('/', updateAll(model, {silent: true}));
  router.put('/:id', update(model));
  router.put('/:id/silent', update(model, {silent: true}));
  router.delete('/:id', remove(model));
  router.get('/:id/publish', publish(model));
  router.get('/:id/unpublish', unpublish(model));
  router.get('/:id/future', findFuture(model));
};

module.exports = {
  findOne,
  findAll,
  create,
  update,
  remove,
  publish,
  unpublish,
  enable,
  disable,
  buildCoreCrudRoutes,
  buildAppCrudRoutes,
};
