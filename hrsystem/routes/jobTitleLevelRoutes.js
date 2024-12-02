const express = require("express");
const router = express.Router();
const jobTitleLevelController = require("../controllers/jobTitleLevelController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_JOB_TITLE_LEVEL"),
  jobTitleLevelController.createJobTitleLevel
);

router.get(
  "/",
  checkPermission("VIEW_JOB_TITLE_LEVEL"),
  jobTitleLevelController.getAllJobTitleLevels
);

router.put(
  "/:id",
  checkPermission("UPDATE_JOB_TITLE_LEVEL"),
  jobTitleLevelController.updateJobTitleLevel
);

router.patch(
  "/:id",
  checkPermission("DEACTIVATE_JOB_TITLE_LEVEL"),
  jobTitleLevelController.deactivateJobTitleLevel
);

router.delete(
  "/:id",
  checkPermission("DELETE_JOB_TITLE_LEVEL"),
  jobTitleLevelController.deleteJobTitleLevel
);

module.exports = router;