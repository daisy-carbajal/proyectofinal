const express = require('express');
const evaluationParameterWeightController = require("../controllers/evaluationParameterWeightController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_OPTIONS"), evaluationParameterWeightController.createEvaluationParameterWeight);

router.get('/', checkPermission("VIEW_OPTIONS"), evaluationParameterWeightController.getAllEvaluationParameterWeight);

router.put('/u/:id', checkPermission("EDIT_OPTIONS"), evaluationParameterWeightController.updateEvaluationParameterWeight);

router.delete('/:id', checkPermission("DELETE_OPTIONS"), evaluationParameterWeightController.deleteEvaluationParameterWeight);

module.exports = router;
