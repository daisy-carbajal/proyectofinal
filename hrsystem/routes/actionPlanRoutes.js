const express = require('express');
const actionPlanController = require("../controllers/actionPlanController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_ACTION_PLAN"), actionPlanController.createActionPlan);

router.get('/', checkPermission("VIEW_ACTION_PLAN"), actionPlanController.getAllActionPlans);

router.get('/user/:UserID', checkPermission("VIEW_ACTION_PLAN"), actionPlanController.getActionPlansByUserID);

router.put('/:id', checkPermission("EDIT_ACTION_PLAN"), actionPlanController.updateActionPlan);

router.put('/deactivate/:id', checkPermission("DEACTIVATE_ACTION_PLAN"), actionPlanController.deactivateActionPlan);

router.delete('/:id', checkPermission("DELETE_ACTION_PLAN"), actionPlanController.deleteActionPlan);

module.exports = router;