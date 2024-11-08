const express = require("express");
const router = express.Router();
const jobTitleDepartmentController = require("../controllers/jobTitleDepartmentController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_OPTIONS"), jobTitleDepartmentController.createJobTitleDepartment);

router.get("/", checkPermission("VIEW_OPTIONS"), jobTitleDepartmentController.getAllJobTitleDepartments);

router.get("/:id", checkPermission("VIEW_OPTIONS"), jobTitleDepartmentController.getJobTitlesByDepartmentId);

router.put("/:id", checkPermission("EDIT_OPTIONS"), jobTitleDepartmentController.updateJobTitleDepartment);

router.put("/d/:id", checkPermission("DELETE_OPTIONS"), jobTitleDepartmentController.deactivateJobTitleDepartment);

module.exports = router;