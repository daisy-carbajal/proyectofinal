const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { departmentValidations } = require("../models/department");
const { validateFields } = require("../middlewares/validateFields");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_OPTIONs"), departmentValidations, validateFields, departmentController.createDepartment);

router.get("/", checkPermission("VIEW_OPTIONS"), departmentController.getAllDepartments);

router.get("/:id", checkPermission("VIEW_OPTIONS"), departmentController.getDepartmentById);

router.put("/u/:id", checkPermission("EDIT_OPTIONS"), departmentValidations, validateFields, departmentController.updateDepartment);

router.put("/d/:id", checkPermission("EDIT_OPTIONS"), departmentController.deactivateDepartment);

router.delete("/:id", checkPermission("DELETE_OPTIONS"), departmentController.deleteDepartment);

module.exports = router;