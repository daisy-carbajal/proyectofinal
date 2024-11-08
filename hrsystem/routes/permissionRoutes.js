const express = require('express');
const permissionController = require("../controllers/permissionController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_OPTIONS"), permissionController.addPermission);

router.get('/', checkPermission("VIEW_OPTIONS"), permissionController.getAllPermissions);

router.put('/d/:id', checkPermission("VIEW_OPTIONS"), permissionController.deactivatePermission);

router.delete('/:id', checkPermission("DELETE_OPTIONS"), permissionController.deletePermission);

module.exports = router;