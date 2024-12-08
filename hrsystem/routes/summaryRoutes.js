const express = require("express");
const summaryController = require("../controllers/summaryController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");

router.use(verifyToken);

// Ruta para obtener el conteo de incidentes activos
router.get("/active-incidents-count", summaryController.getActiveIncidentsCount);

// Ruta para obtener el conteo de evaluaciones no revisadas
router.get("/unreviewed-evaluations-count", summaryController.getUnreviewedEvaluationsCount);

// Ruta para obtener el conteo de acciones disciplinarias no reconocidas
router.get("/unacknowledged-actions-count", summaryController.getUnacknowledgedDisciplinaryActionsCount);

// Ruta para obtener el conteo de comentarios creados hoy
router.get("/today-comments-count", summaryController.getTodayCommentFeedbackCount);

module.exports = router;