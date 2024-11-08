const express = require("express");
const router = express.Router();
const disciplinaryActionController = require("../controllers/disciplinaryActionController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_DISCIPLINARY_ACTION"), disciplinaryActionController.createDisciplinaryAction);

router.get("/", checkPermission("VIEW_DISCIPLINARY_ACTION"), disciplinaryActionController.getAllDisciplinaryActions);

router.get("/:id", checkPermission("VIEW_DISCIPLINARY_ACTION"), disciplinaryActionController.getDisciplinaryActionByUserId);

router.put("/u/:id", checkPermission("EDIT_DISCIPLINARY_ACTION"), disciplinaryActionController.updateDisciplinaryAction);

router.put("/d/:id", checkPermission("EDIT_DISCIPLINARY_ACTION"), disciplinaryActionController.deactivateDisciplinaryAction);

router.delete("/:id", checkPermission("DELETE_DISCIPLINARY_ACTION"), disciplinaryActionController.deleteDisciplinaryAction);

module.exports = router;