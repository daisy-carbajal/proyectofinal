const express = require("express");
const router = express.Router();
const disciplinaryActionReasonController = require("../controllers/disciplinaryActionReasonController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_OPTIONS"), disciplinaryActionReasonController.createDisciplinaryActionReason);

router.get("/", checkPermission("VIEW_OPTIONS"), disciplinaryActionReasonController.getAllDisciplinaryActionReasons);

router.get("/:id", checkPermission("VIEW_OPTIONS"), disciplinaryActionReasonController.getDisciplinaryActionReasonById);

router.put("/u/:id", checkPermission("EDIT_OPTIONS"), disciplinaryActionReasonController.updateDisciplinaryActionReason);

router.delete("/:id", checkPermission("DELETE_OPTIONS"), disciplinaryActionReasonController.deleteDisciplinaryActionReason);

module.exports = router;