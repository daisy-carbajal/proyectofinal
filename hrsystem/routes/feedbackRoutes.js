const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("PROVIDE_FEEDBACK"),
  feedbackController.createFeedback
);

router.get(
  "/",
  checkPermission("VIEW_FEEDBACK"),
  feedbackController.getAllFeedbacks
);

router.get(
  "/:id",
  checkPermission("VIEW_FEEDBACK"),
  feedbackController.getFeedbackById
);

router.put(
  "/:id",
  checkPermission("EDIT_FEEDBACK"),
  feedbackController.updateFeedback
);

router.delete(
  "/:id",
  checkPermission("DELETE_FEEDBACK"),
  feedbackController.deleteFeedback
);

module.exports = router;
