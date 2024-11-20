const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { roleValidations } = require("../models/role");
const { validateFields } = require("../middlewares/validateFields");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post(
  "/",
  checkPermission("CREATE_SETTINGS"),
  roleValidations,
  validateFields,
  roleController.createRole
);
router.get("/", checkPermission("VIEW_SETTINGS"), roleController.getAllRoles);
router.get("/:id", checkPermission("VIEW_SETTINGS"), roleController.getRoleById);
router.put(
  "/u/:id",
  checkPermission("EDIT_SETTINGS"),
  roleValidations,
  validateFields,
  roleController.updateRole
);
router.patch(
  "/d/:id",
  checkPermission("EDIT_SETTINGS"),
  roleController.deactivateRole
);
router.delete(
  "/:id",
  checkPermission("DELETE_SETTINGS"),
  roleController.deleteRole
);

module.exports = router;
