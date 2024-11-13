const express = require('express');
const disciplinaryActionTaskController = require("../controllers/disciplinaryActionTaskController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_DISCIPLINARY_ACTION"), disciplinaryActionTaskController.createDisciplinaryActionTask);

router.get('/', checkPermission("VIEW_DISCIPLINARY_ACTION"), disciplinaryActionTaskController.getAllDisciplinaryActionTasks);

router.get('/da/:id', checkPermission("VIEW_DISCIPLINARY_ACTION"), disciplinaryActionTaskController.getAllDisciplinaryActionTasksByDAID);

router.put('/u/:id', checkPermission("EDIT_DISCIPLINARY_ACTION"), disciplinaryActionTaskController.updateDisciplinaryActionTask);

router.put('/d/:id', checkPermission("DEACTIVATE_DISCIPLINARY_ACTION"), disciplinaryActionTaskController.deactivateDisciplinaryActionTask);

router.delete('/:id', checkPermission("DELETE_DISCIPLINARY_ACTION"), disciplinaryActionTaskController.deleteDisciplinaryActionTask);

module.exports = router;