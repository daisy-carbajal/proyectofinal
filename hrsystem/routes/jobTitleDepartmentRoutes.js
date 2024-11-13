const express = require("express");
const router = express.Router();
const jobTitleDepartmentController = require("../controllers/jobTitleDepartmentController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_SETTINGS"), jobTitleDepartmentController.createJobTitleDepartment);

router.get("/", checkPermission("VIEW_SETTINGS"), jobTitleDepartmentController.getAllJobTitleDepartments);

router.get("/:id", checkPermission("VIEW_SETTINGS"), jobTitleDepartmentController.getJobTitlesByDepartmentId);

router.put("/u/:id", checkPermission("EDIT_SETTINGS"), jobTitleDepartmentController.updateJobTitleDepartment);

router.put("/d/:id", checkPermission("DELETE_SETTINGS"), jobTitleDepartmentController.deactivateJobTitleDepartment);

module.exports = router;