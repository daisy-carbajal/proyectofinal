const express = require('express');
const rolePermissionController = require("../controllers/rolePermissionController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_OPTIONS"), rolePermissionController.addRolePermission);

router.get('/', checkPermission("VIEW_OPTIONS"), rolePermissionController.getAllRolePermissions);

router.put('/d/:id', checkPermission("EDIT_OPTIONS"), rolePermissionController.deactivateRolePermission);

router.delete('/:id', checkPermission("DELETE_OPTIONS"), rolePermissionController.deleteRolePermission);

module.exports = router;