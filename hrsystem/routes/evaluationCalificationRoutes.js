const express = require("express");
const evaluationCalificationController = require("../controllers/evaluationCalificationController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_OPTIONS"),
  evaluationCalificationController.createEvaluationCalification
);

router.get(
  "/",
  checkPermission("VIEW_OPTIONS"),
  evaluationCalificationController.getAllEvaluationCalifications
);

router.put(
  "/u/:id",
  checkPermission("EDIT_OPTIONS"),
  evaluationCalificationController.updateEvaluationCalification
);

router.patch(
  "/d/:id",
  checkPermission("DEACTIVATE_OPTIONS"),
  evaluationCalificationController.deactivateEvaluationCalification
);

router.delete(
  "/:id",
  checkPermission("DELETE_OPTIONS"),
  evaluationCalificationController.deleteEvaluationCalification
);

module.exports = router;
