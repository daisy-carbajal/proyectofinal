const express = require('express');
const actionPlanTaskController = require("../controllers/actionPlanTaskController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_ACTION_PLAN"), actionPlanTaskController.createActionPlanTask);

router.get('/:ActionPlanID', checkPermission("VIEW_ACTION_PLAN"), actionPlanTaskController.getActionPlanTasksByActionPlanID);

router.put('/:id', checkPermission("EDIT_ACTION_PLAN"), actionPlanTaskController.updateActionPlanTask);

router.put('/d/:id', checkPermission("DEACTIVATE_ACTION_PLAN"), actionPlanTaskController.deactivateActionPlanTask);

router.delete('/:id', checkPermission("DELETE_ACTION_PLAN"), actionPlanTaskController.deleteActionPlanTask);

module.exports = router;
