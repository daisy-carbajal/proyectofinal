const express = require("express");
const router = express.Router();
const userRoleController = require("../controllers/userRoleController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_USER"), userRoleController.createUserRole);

router.get("/", checkPermission("VIEW_USER"), userRoleController.getAllUserRoles);

router.get("/:id", checkPermission("VIEW_USER"), userRoleController.getUserRoleById);

router.put("/:id", checkPermission("EDIT_USER"), userRoleController.updateStartDateUserRole);

module.exports = router;
