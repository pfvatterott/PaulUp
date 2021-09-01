const router = require("express").Router();
const workspacesController = require("../../controllers/workspacesController");

// Matches with "/api/books"
router.route("/")
  .get(workspacesController.findAll)
  .post(workspacesController.create);

// Matches with "/api/books/:id"
router
  .route("/:id")
  .get(workspacesController.findById)
  .put(workspacesController.update)
  .delete(workspacesController.remove);

router
  .route("/user/:id")
  .get(workspacesController.findByUserId)

module.exports = router;
