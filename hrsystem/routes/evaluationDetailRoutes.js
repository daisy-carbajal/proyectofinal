const express = require("express");
const evaluationDetailController = require("../controllers/evaluationDetailController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_EVALUATION"),
  evaluationDetailController.createEvaluationDetail
);

router.get(
  "/:id",
  checkPermission("VIEW_EVALUATION"),
  evaluationDetailController.getEvaluationDetailsByEvaluationMasterID
);

router.put(
  "/u/:id",
  checkPermission("EDIT_EVALUATION"),
  evaluationDetailController.updateEvaluationDetail
);

router.patch(
  "/d/:id",
  checkPermission("EDIT_EVALUATION"),
  evaluationDetailController.deactivateEvaluationDetail
);

router.delete(
  "/:id",
  checkPermission("DELETE_EVALUATION"),
  evaluationDetailController.deleteEvaluationDetail
);

module.exports = router;
