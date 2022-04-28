const router = require("express").Router();
const spaceRoutes = require("./spaces");
const userRoutes = require("./users");
const workspaceRoutes = require("./workspaces")
const folderRoutes = require("./folders")
const listRoutes = require("./lists")
const taskRoutes = require("./task")
const taskHistoryRoutes = require("./taskHistory")

// Book routes
router.use("/spaces", spaceRoutes);
router.use("/users", userRoutes);
router.use("/workspaces", workspaceRoutes)
router.use("/folders", folderRoutes)
router.use("/lists", listRoutes)
router.use("/tasks", taskRoutes)
router.use("/taskHistory", taskHistoryRoutes)

module.exports = router;
