const express = require('express');
const rolePermissionController = require("../controllers/rolePermissionController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_SETTINGS"), rolePermissionController.addRolePermission);

router.get('/', checkPermission("VIEW_SETTINGS"), rolePermissionController.getAllRolePermissions);

router.put('/d/:id', checkPermission("EDIT_SETTINGS"), rolePermissionController.deactivateRolePermission);

router.delete('/:id', checkPermission("DELETE_SETTINGS"), rolePermissionController.deleteRolePermission);

module.exports = router;