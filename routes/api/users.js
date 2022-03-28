const router = require("express").Router();
const usersController = require("../../controllers/usersController");

// Matches with "/api/books"
router.route("/")
  .get(usersController.findAll)
  .post(usersController.create);

// Matches with "/api/books/:id"
router
  .route("/:id")
  .get(usersController.findById)
  .put(usersController.update)
  .delete(usersController.remove);

router
  .route('/google/:id')
  .get(usersController.findByGoogleId)

router
  .route('/email/:id')
  .get(usersController.findByEmail)


router.get('search/:name', (req, res) => {
  console.log(res)
})

module.exports = router;
