const router = require("express").Router();
const spaceRoutes = require("./spaces");
const userRoutes = require("./users");

// Book routes
router.use("/spaces", spaceRoutes);
router.use("/users", userRoutes);

module.exports = router;
