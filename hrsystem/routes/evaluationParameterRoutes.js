const express = require('express');
const evaluationParameterController = require("../controllers/evaluationParameterController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_OPTIONS"), evaluationParameterController.createEvaluationParameter);

router.get('/', checkPermission("VIEW_OPTIONS"), evaluationParameterController.getAllEvaluationParameters);

router.put('/u/:id', checkPermission("EDIT_OPTIONS"), evaluationParameterController.updateEvaluationParameter);

router.put('/d/:id', checkPermission("EDIT_OPTIONS"), evaluationParameterController.deactivateEvaluationParameter);

router.delete('/:id', checkPermission("DELETE_OPTIONS"), evaluationParameterController.deleteEvaluationParameter);

module.exports = router;
