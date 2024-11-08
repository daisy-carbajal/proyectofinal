const express = require("express");
const router = express.Router();
const jobTitleChangeController = require("../controllers/jobTitleChangeController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_OPTIONS"), jobTitleChangeController.createJobTitleChange);

router.get("/", checkPermission("VIEW_OPTIONS"), jobTitleChangeController.getAllJobTitleChanges);

router.get("/:id", checkPermission("VIEW_OPTIONS"), jobTitleChangeController.getJobTitleChangeById);

router.put("/:id", checkPermission("EDIT_OPTIONS"), jobTitleChangeController.updateJobTitleChange);

router.put("/d/:id", checkPermission("DELETE_OPTIONS"), jobTitleChangeController.deactivateJobTitleChange);

module.exports = router;