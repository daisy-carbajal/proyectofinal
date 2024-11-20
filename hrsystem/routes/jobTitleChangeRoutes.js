const express = require("express");
const router = express.Router();
const jobTitleChangeController = require("../controllers/jobTitleChangeController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");
const { check } = require("express-validator");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_USER"),
  jobTitleChangeController.createJobTitleChange
);

router.get(
  "/",
  checkPermission("VIEW_USER"),
  jobTitleChangeController.getAllJobTitleChanges
);

router.get(
  "/:id",
  checkPermission("VIEW_USER"),
  jobTitleChangeController.getJobTitleChangeById
);

router.put(
  "/u/:id",
  checkPermission("EDIT_USER"),
  jobTitleChangeController.updateJobTitleChange
);

router.patch(
  "/d/:id",
  checkPermission("DELETE_USER"),
  jobTitleChangeController.deactivateJobTitleChange
);

router.put(
  "/approve/:id",
  checkPermission("EDIT_USER"),
  jobTitleChangeController.approveChanges
);

router.put(
  "/deny/:id",
  checkPermission("EDIT_USER"),
  jobTitleChangeController.denyChanges
);

router.get(
  "/changes/pending",
  checkPermission("VIEW_USER"),
  jobTitleChangeController.getPendingChanges
);

router.get(
  "/change-detail/current-details/:id",
  checkPermission("VIEW_USER"),
  jobTitleChangeController.getCurrentDetailsByID
);

router.get(
  "/change-detail/pending-changes/:id",
  checkPermission("VIEW_USER"),
  jobTitleChangeController.getPendingChangesByID
);

module.exports = router;
