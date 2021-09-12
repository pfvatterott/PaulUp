const router = require("express").Router();
const listController = require("../../controllers/listController");

// Matches with "/api/books"
router.route("/")
  .get(listController.findAll)
  .post(listController.create);

// Matches with "/api/books/:id"
router
  .route("/:id")
  .get(listController.findById)
  .put(listController.update)
  .delete(listController.remove);

router
  .route("/user/:id")
  .get(listController.findByUserId)

router
  .route("/space/:id")
  .get(listController.findBySpaceId)

router
  .route("/folder/:id")
  .get(listController.findByFolderId)



module.exports = router;
