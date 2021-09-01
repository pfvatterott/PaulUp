const router = require("express").Router();
const folderController = require("../../controllers/folderController");

// Matches with "/api/books"
router.route("/")
  .get(folderController.findAll)
  .post(folderController.create);

// Matches with "/api/books/:id"
router
  .route("/:id")
  .get(folderController.findById)
  .put(folderController.update)
  .delete(folderController.remove);

router
  .route("/user/:id")
  .get(folderController.findByUserId)

module.exports = router;
