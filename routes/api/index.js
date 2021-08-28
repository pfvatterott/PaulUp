const router = require("express").Router();
const spaceRoutes = require("./spaces");

// Book routes
router.use("/spaces", spaceRoutes);

module.exports = router;
