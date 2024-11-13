const express = require("express");
const router = express.Router();
const jobTitleController = require("../controllers/jobTitleController");
const { jobTitleValidations } = require("../models/jobTitle");
const { validateFields } = require("../middlewares/validateFields");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_SETTINGS"),
  jobTitleValidations,
  validateFields,
  jobTitleController.createJobTitle
);

router.get(
  "/",
  checkPermission("VIEW_SETTINGS"),
  jobTitleController.getAllJobTitles
);

router.get(
  "/details",
  checkPermission("VIEW_SETTINGS"),
  jobTitleController.getAllJobTitleDetails
);

router.get(
  "/:id",
  checkPermission("EDIT_SETTINGS"),
  jobTitleController.getJobTitleById
);

router.put(
  "/u/:id",
  checkPermission("DELETE_SETTINGS"),
  jobTitleValidations,
  validateFields,
  jobTitleController.updateJobTitle
);

router.put("/d/:id", jobTitleController.deactivateJobTitle);

router.delete("/:id", jobTitleController.deleteJobTitle);

module.exports = router;
