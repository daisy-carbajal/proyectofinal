const express = require('express');
const actionPlanParameterController = require("../controllers/actionPlanParameterController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_ACTION_PLAN"), actionPlanParameterController.createActionPlanParameter);

router.get('/:ActionPlanID', checkPermission("VIEW_ACTION_PLAN"), actionPlanParameterController.getActionPlanParametersByActionPlanID);

router.put('/:id', checkPermission("EDIT_ACTION_PLAN"), actionPlanParameterController.updateActionPlanParameter);

router.delete('/:id', checkPermission("DELETE_ACTION_PLAN"), actionPlanParameterController.deleteActionPlanParameter);

module.exports = router;