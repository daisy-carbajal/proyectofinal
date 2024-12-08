const express = require('express');
const actionPlanController = require("../controllers/actionPlanController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_ACTION_PLAN"), actionPlanController.createActionPlan);

router.get('/', checkPermission("VIEW_ACTION_PLAN"), actionPlanController.getAllActionPlans);

router.get('/user/:id', checkPermission("VIEW_ACTION_PLAN"), actionPlanController.getActionPlansByUserID);

router.get('/details/:id', checkPermission("VIEW_ACTION_PLAN"), actionPlanController.getActionPlanWithDetailsByID);

router.put('/u/:id', checkPermission("EDIT_ACTION_PLAN"), actionPlanController.updateActionPlan);

router.patch('/d/:id', checkPermission("EDIT_ACTION_PLAN"), actionPlanController.deactivateActionPlan);

router.patch('/a/:id', checkPermission("EDIT_ACTION_PLAN"), actionPlanController.acknowledgeActionPlan);

router.delete('/:id', checkPermission("DELETE_ACTION_PLAN"), actionPlanController.deleteActionPlan);

module.exports = router;