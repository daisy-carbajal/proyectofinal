const express = require("express");
const router = express.Router();
const userRoleController = require("../controllers/userRoleController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_OPTIONS"), userRoleController.createUserRole);

router.get("/", checkPermission("VIEW_OPTIONS"), userRoleController.getAllUserRoles);

router.get("/:id", checkPermission("VIEW_OPTIONS"), userRoleController.getUserRoleById);

router.put("/:id", checkPermission("EDIT_OPTIONS"), userRoleController.updateStartDateUserRole);

module.exports = router;
