const router = require("express").Router();
const usersController = require("../../controllers/usersController");

// Matches with "/api/books"
router.route("/")
  .get(usersController.findAll)
  .post(usersController.create);

// Matches with "/api/books/:id"
router
  .route("/:id")
  .get(usersController.findByGoogleId)
  .put(usersController.update)
  .delete(usersController.remove);

router.get('search/:name', (req, res) => {
  console.log(res)
})

module.exports = router;
