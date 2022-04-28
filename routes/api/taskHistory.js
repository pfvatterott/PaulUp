const router = require("express").Router();
const taskHistoryController = require("../../controllers/taskHistoryController.js");

// Matches with "/api/books"
router.route("/")
  .post(taskHistoryController.create);

router
  .route("/task/:id")
  .get(taskHistoryController.findByTaskId)

module.exports = router;
