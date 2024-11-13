const express = require('express');
const evaluationDetailController = require("../controllers/evaluationDetailController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_EVALUATION"), evaluationDetailController.createEvaluationDetail);

router.get('/:EvaluationMasterID', checkPermission("VIEW_EVALUATION"), evaluationDetailController.getEvaluationDetailsByEvaluationMasterID);

router.put('/:id', checkPermission("EDIT_EVALUATION"), evaluationDetailController.updateEvaluationDetail);

router.put('/d/:id', checkPermission("EDIT_EVALUATION"), evaluationDetailController.deactivateEvaluationDetail);

router.delete('/:id', checkPermission("DELETE_EVALUATION"), evaluationDetailController.deleteEvaluationDetail);

module.exports = router;