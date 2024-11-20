const express = require("express");
const permissionController = require("../controllers/permissionController");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_SETTINGS"),
  permissionController.addPermission
);

router.get(
  "/",
  checkPermission("VIEW_SETTINGS"),
  permissionController.getAllPermissions
);

router.patch(
    "/changes/d/:id",
    checkPermission("EDIT_SETTINGS"),
    permissionController.deactivatePermission
  );

router.put(
  "/u/:id",
  checkPermission("EDIT_SETTINGS"),
  permissionController.updatePermission
);

router.delete(
  "/:id",
  checkPermission("DELETE_SETTINGS"),
  permissionController.deletePermission
);

module.exports = router;
