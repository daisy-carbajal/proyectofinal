const express = require('express');
const permissionCategoryController = require("../controllers/permissionCategoryController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post('/', checkPermission("CREATE_SETTINGS"), permissionCategoryController.createPermissionCategory);

router.get('/', checkPermission("VIEW_SETTINGS"), permissionCategoryController.getAllPermissionCategory);

router.get('/categories', checkPermission("VIEW_SETTINGS"), permissionCategoryController.getAllPermissionsByCategory);

router.get('/:id', checkPermission("VIEW_SETTINGS"), permissionCategoryController.getPermissionsByCategory);

router.put('/u/:id', checkPermission("EDIT_SETTINGS"), permissionCategoryController.updatePermissionCategory);

router.put('/deactivate/:id', checkPermission("DEACTIVATE_SETTINGS"), permissionCategoryController.deactivatePermissionCategory);

router.delete('/:id', checkPermission("DELETE_SETTINGS"), permissionCategoryController.deletePermissionCategory);

module.exports = router;