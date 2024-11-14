const express = require('express');
const evaluationSavedController = require("../controllers/evaluationSavedController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_EVALUATION"), evaluationSavedController.createEvaluationSaved);

router.get('/', checkPermission("VIEW_EVALUATION"), evaluationSavedController.getAllEvaluationSaved);

router.get('/filtered', checkPermission("VIEW_EVALUATION"), evaluationSavedController.getEvaluationSavedFiltered);

router.put('/d/:id', checkPermission("EDIT_EVALUATION"), evaluationSavedController.deactivateEvaluationSaved);

router.delete('/:id', checkPermission("DELETE_EVALUATION"), evaluationSavedController.deleteEvaluationSaved);

module.exports = router;