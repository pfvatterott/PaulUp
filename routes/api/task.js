const router = require("express").Router();
const taskController = require("../../controllers/taskController");

// Matches with "/api/books"
router.route("/")
  .get(taskController.findAll)
  .post(taskController.create);

// Matches with "/api/books/:id"
router
  .route("/:id")
  .get(taskController.findById)
  .put(taskController.update)
  .delete(taskController.remove);

router
  .route("/user/:id")
  .get(taskController.findByUserId)

router
  .route("/list/:id")
  .get(taskController.findByListId)

module.exports = router;
