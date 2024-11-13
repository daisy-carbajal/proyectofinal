const express = require('express');
const evaluationTypeController = require("../controllers/evaluationTypeController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_OPTIONS"), evaluationTypeController.createEvaluationType);

router.get('/', checkPermission("VIEW_OPTIONS"), evaluationTypeController.getAllEvaluationTypes);

router.put('/u/:id', checkPermission("EDIT_OPTIONS"), evaluationTypeController.updateEvaluationType);

router.put('/d/:id', checkPermission("EDIT_OPTIONS"), evaluationTypeController.deactivateEvaluationType);

router.delete('/:id', checkPermission("DELETE_OPTIONS"), evaluationTypeController.deleteEvaluationType);

module.exports = router;