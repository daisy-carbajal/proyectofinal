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
  checkPermission("CREATE_OPTIONS"),
  roleValidations,
  validateFields,
  roleController.createRole
);
router.get("/", checkPermission("VIEW_OPTIONS"), roleController.getAllRoles);
router.get("/:id", checkPermission("VIEW_OPTIONS"), roleController.getRoleById);
router.put(
  "/u/:id",
  checkPermission("EDIT_OPTIONS"),
  roleValidations,
  validateFields,
  roleController.updateRole
);
router.put(
  "/d/:id",
  checkPermission("EDIT_OPTIONS"),
  roleController.deactivateRole
);
router.delete(
  "/:id",
  checkPermission("DELETE_OPTIONS"),
  roleController.deleteRole
);

module.exports = router;
