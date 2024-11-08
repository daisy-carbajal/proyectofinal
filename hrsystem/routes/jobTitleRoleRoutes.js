const express = require("express");
const router = express.Router();
const jobTitleRoleController = require("../controllers/jobTitleRoleController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_OPTIONS"), jobTitleRoleController.createJobTitleRole);

router.get("/", checkPermission("VIEW_OPTIONS"), jobTitleRoleController.getAllJobTitleRoles);

router.get("/:id", checkPermission("VIEW_OPTIONS"), jobTitleRoleController.getJobTitleRoleById);

router.put("/:id", checkPermission("EDIT_OPTIONS"), jobTitleRoleController.updateJobTitleRole);

router.put("/deactivate/:id", checkPermission("DELETE_OPTIONS"), jobTitleRoleController.deactivateJobTitleRole);

module.exports = router;
