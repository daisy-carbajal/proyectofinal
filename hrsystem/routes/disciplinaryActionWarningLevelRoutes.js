const express = require("express");
const router = express.Router();
const disciplinaryActionWarningLevelController = require("../controllers/disciplinaryActionWarningLevelController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_OPTIONS"), disciplinaryActionWarningLevelController.createWarningLevel);

router.get("/", checkPermission("VIEW_OPTIONS"), disciplinaryActionWarningLevelController.getAllWarningLevels);

router.get("/filtered/", checkPermission("VIEW_OPTIONS"), disciplinaryActionWarningLevelController.getWarningLevelFiltered);

router.get("/:id", checkPermission("VIEW_OPTIONS"), disciplinaryActionWarningLevelController.getWarningLevelById);

router.put("/u/:id", checkPermission("EDIT_OPTIONS"), disciplinaryActionWarningLevelController.updateWarningLevel);

router.patch("/d/:id", checkPermission("EDIT_OPTIONS"), disciplinaryActionWarningLevelController.deactivateWarningLevel);

router.delete("/:id", checkPermission("DELETE_OPTIONS"), disciplinaryActionWarningLevelController.deleteWarningLevel);

module.exports = router;