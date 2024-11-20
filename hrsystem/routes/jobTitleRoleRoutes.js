const express = require("express");
const router = express.Router();
const jobTitleRoleController = require("../controllers/jobTitleRoleController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_SETTINGS"), jobTitleRoleController.createJobTitleRole);

router.get("/", checkPermission("VIEW_SETTINGS"), jobTitleRoleController.getAllJobTitleRoles);

router.get("/:id", checkPermission("VIEW_SETTINGS"), jobTitleRoleController.getJobTitleRoleById);

router.put("/u/:id", checkPermission("EDIT_SETTINGS"), jobTitleRoleController.updateJobTitleRole);

router.patch("/d/:id", checkPermission("DELETE_SETTINGS"), jobTitleRoleController.deactivateJobTitleRole);

module.exports = router;
