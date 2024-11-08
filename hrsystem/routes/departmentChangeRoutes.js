const express = require("express");
const router = express.Router();
const departmentChangeController = require("../controllers/departmentChangeController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_OPTIONS"), departmentChangeController.createDepartmentChange);

router.get("/", checkPermission("VIEW_OPTIONS"), departmentChangeController.getAllDepartmentChanges);

router.get("/:id", checkPermission("VIEW_OPTIONS"), departmentChangeController.getDepartmentChangeById);

router.put("/:id", checkPermission("EDIT_OPTIONS"), departmentChangeController.updateStartDateDepartmentChange);

router.put("/deactivate/:id", checkPermission("EDIT_OPTIONS"), departmentChangeController.deactivateDepartmentChange);

module.exports = router;