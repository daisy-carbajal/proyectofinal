const express = require('express');
const rolePermissionController = require("../controllers/rolePermissionController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_SETTINGS"), rolePermissionController.addRolePermission);

router.get('/', checkPermission("VIEW_SETTINGS"), rolePermissionController.getAllRolePermissions);

router.get('/:id', checkPermission("VIEW_SETTINGS"), rolePermissionController.getRolePermissionsByRoleID);

router.delete('/:id', checkPermission("DELETE_SETTINGS"), rolePermissionController.deleteRolePermission);

router.post('/m', checkPermission("MANAGE_SETTINGS"), rolePermissionController.manageRolePermissions);

module.exports = router;