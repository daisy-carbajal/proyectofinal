const express = require("express");
const evaluation360Controller = require("../controllers/evaluation360Controller");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

// Middleware para verificar el token en todas las rutas
router.use(verifyToken);

// Crear una nueva evaluación 360
router.post(
  "/",
  checkPermission("CREATE_EVALUATION"),
  evaluation360Controller.createEvaluation360
);

// Obtener todas las evaluaciones 360
router.get(
  "/",
  checkPermission("VIEW_EVALUATION"),
  evaluation360Controller.getAllEvaluation360
);

router.get(
  "/details",
  checkPermission("VIEW_EVALUATION"),
  evaluation360Controller.getEvaluation360Details
);

router.put(
  "/:id",
  checkPermission("EDIT_EVALUATION"),
  evaluation360Controller.updateEvaluation360
);

router.patch(
  "/deactivate/:id",
  checkPermission("EDIT_EVALUATION"),
  evaluation360Controller.deactivateEvaluation360
);

router.delete(
  "/:id",
  checkPermission("DELETE_EVALUATION"),
  evaluation360Controller.deleteEvaluation360
);

router.post(
  "/update-expired",
  checkPermission("EDIT_EVALUATION"),
  evaluation360Controller.updateExpiredEvaluations360
);

module.exports = router;
