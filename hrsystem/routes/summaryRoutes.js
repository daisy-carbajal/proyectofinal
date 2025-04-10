const express = require("express");
const summaryController = require("../controllers/summaryController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");

router.use(verifyToken);

router.get("/active-incidents-count", summaryController.getActiveIncidentsCount);

router.get("/unreviewed-evaluations-count", summaryController.getUnreviewedEvaluationsCount);

router.get("/unacknowledged-actions-count", summaryController.getUnacknowledgedDisciplinaryActionsCount);

router.get("/today-comments-count", summaryController.getTodayCommentFeedbackCount);

module.exports = router;