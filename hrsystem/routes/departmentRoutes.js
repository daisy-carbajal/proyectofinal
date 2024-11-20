const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { departmentValidations } = require("../models/department");
const { validateFields } = require("../middlewares/validateFields");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_SETTINGS"), departmentValidations, validateFields, departmentController.createDepartment);

router.get("/", checkPermission("VIEW_SETTINGS"), departmentController.getAllDepartments);

router.get("/:id", checkPermission("VIEW_SETTINGS"), departmentController.getDepartmentById);

router.put("/u/:id", checkPermission("EDIT_SETTINGS"), departmentValidations, validateFields, departmentController.updateDepartment);

router.patch("/d/:id", checkPermission("EDIT_SETTINGS"), departmentController.deactivateDepartment);

router.delete("/:id", checkPermission("DELETE_SETTINGS"), departmentController.deleteDepartment);

module.exports = router;