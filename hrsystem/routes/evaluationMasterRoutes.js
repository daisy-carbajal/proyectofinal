const express = require('express');
const evaluationMasterController = require("../controllers/evaluationMasterController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_EVALUATION"), evaluationMasterController.createEvaluationMaster);

router.get('/', checkPermission("VIEW_EVALUATION"), evaluationMasterController.getAllEvaluationMaster);

router.get('/eval/:id', checkPermission("VIEW_EVALUATION"), evaluationMasterController.getEvaluationMasterByEvaluationID);

router.get('/user/:ID', checkPermission("VIEW_EVALUATION"), evaluationMasterController.getEvaluationMasterByUserID);

router.put('/d/:id', checkPermission("EDIT_EVALUATION"), evaluationMasterController.deactivateEvaluationMaster);

router.delete('/:id', checkPermission("DELETE_EVALUATION"), evaluationMasterController.deleteEvaluationMaster);

module.exports = router;
