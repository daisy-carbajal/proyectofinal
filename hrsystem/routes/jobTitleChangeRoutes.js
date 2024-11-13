const express = require("express");
const router = express.Router();
const jobTitleChangeController = require("../controllers/jobTitleChangeController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_USER"), jobTitleChangeController.createJobTitleChange);

router.get("/", checkPermission("VIEW_USER"), jobTitleChangeController.getAllJobTitleChanges);

router.get("/:id", checkPermission("VIEW_USER"), jobTitleChangeController.getJobTitleChangeById);

router.put("/u/:id", checkPermission("EDIT_USER"), jobTitleChangeController.updateJobTitleChange);

router.put("/d/:id", checkPermission("DELETE_USER"), jobTitleChangeController.deactivateJobTitleChange);

module.exports = router;