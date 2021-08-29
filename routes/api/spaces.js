const router = require("express").Router();
const spacesController = require("../../controllers/spacesController");

// Matches with "/api/books"
router.route("/")
  .get(spacesController.findAll)
  .post(spacesController.create);

// Matches with "/api/books/:id"
router
  .route("/:id")
  .get(spacesController.findById)
  .put(spacesController.update)
  .delete(spacesController.remove);

router
  .route("/user/:id")
  .get(spacesController.findByUserId)

module.exports = router;
