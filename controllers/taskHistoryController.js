const db = require("../models");

// Defining methods for the ListsController
module.exports = {
  findByTaskId: function(req, res) {
    db.TaskHistory
      .find({
          task_id: req.params.id
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.TaskHistory
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};
