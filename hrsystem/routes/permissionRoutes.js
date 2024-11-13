const express = require('express');
const permissionController = require("../controllers/permissionController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_SETTINGS"), permissionController.addPermission);

router.get('/', checkPermission("VIEW_SETTINGS"), permissionController.getAllPermissions);

router.put('/d/:id', checkPermission("VIEW_SETTINGS"), permissionController.deactivatePermission);

router.delete('/:id', checkPermission("DELETE_SETTINGS"), permissionController.deletePermission);

module.exports = router;