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
  checkPermission("CREATE_OPTIONS"),
  jobTitleValidations,
  validateFields,
  jobTitleController.createJobTitle
);

router.get(
  "/",
  checkPermission("VIEW_OPTIONS"),
  jobTitleController.getAllJobTitles
);

router.get(
  "/details",
  checkPermission("VIEW_OPTIONS"),
  jobTitleController.getAllJobTitleDetails
);

router.get(
  "/:id",
  checkPermission("EDIT_OPTIONS"),
  jobTitleController.getJobTitleById
);

router.put(
  "/u/:id",
  checkPermission("DELETE_OPTIONS"),
  jobTitleValidations,
  validateFields,
  jobTitleController.updateJobTitle
);

router.put("/d/:id", jobTitleController.deactivateJobTitle);

router.delete("/:id", jobTitleController.deleteJobTitle);

module.exports = router;
