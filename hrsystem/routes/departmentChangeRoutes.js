const express = require("express");
const router = express.Router();
const departmentChangeController = require("../controllers/departmentChangeController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_USER"), departmentChangeController.createDepartmentChange);

router.get("/", checkPermission("VIEW_USER"), departmentChangeController.getAllDepartmentChanges);

router.get("/:id", checkPermission("VIEW_USER"), departmentChangeController.getDepartmentChangeById);

router.put("/u/:id", checkPermission("EDIT_USER"), departmentChangeController.updateStartDateDepartmentChange);

router.patch("/d/:id", checkPermission("EDIT_USER"), departmentChangeController.deactivateDepartmentChange);

router.post('/approve', checkPermission("EDIT_USER"), departmentChangeController.approveDepartmentChange);

router.post('/deny', checkPermission("EDIT_USER"), departmentChangeController.denyDepartmentChange);

module.exports = router;