const express = require("express");
const router = express.Router();
const disciplinaryActionReasonController = require("../controllers/disciplinaryActionReasonController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_DISCIPLINARY_ACTION"), disciplinaryActionReasonController.createDisciplinaryActionReason);

router.get("/", checkPermission("VIEW_DISCIPLINARY_ACTION"), disciplinaryActionReasonController.getAllDisciplinaryActionReasons);

router.get("/:id", checkPermission("VIEW_DISCIPLINARY_ACTION"), disciplinaryActionReasonController.getDisciplinaryActionReasonById);

router.put("/u/:id", checkPermission("EDIT_DISCIPLINARY_ACTION"), disciplinaryActionReasonController.updateDisciplinaryActionReason);

router.delete("/:id", checkPermission("DELETE_DISCIPLINARY_ACTION"), disciplinaryActionReasonController.deleteDisciplinaryActionReason);

module.exports = router;