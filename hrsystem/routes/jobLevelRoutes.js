const express = require("express");
const router = express.Router();
const jobLevelController = require("../controllers/jobLevelController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_SETTINGS"),
  jobLevelController.createJobLevel
);

router.get(
  "/",
  checkPermission("VIEW_SETTINGS"),
  jobLevelController.getAllJobLevels
);

router.put(
  "/:id",
  checkPermission("EDIT_SETTINGS"),
  jobLevelController.updateJobLevel
);

router.patch(
  "/:id",
  checkPermission("EDIT_SETTINGS"),
  jobLevelController.deactivateJobLevel
);

router.delete(
  "/:id",
  checkPermission("DELETE_SETTINGS"),
  jobLevelController.deleteJobLevel
);

module.exports = router;