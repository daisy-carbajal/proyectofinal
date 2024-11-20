const express = require("express");
const router = express.Router();
const incidentTypeController = require("../controllers/incidentTypeController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_OPTIONS"), incidentTypeController.createIncidentType);

router.get("/", checkPermission("VIEW_OPTIONS"), incidentTypeController.getAllIncidentTypes);

router.get("/:id", checkPermission("VIEW_OPTIONS"), incidentTypeController.getIncidentTypeById);

router.put("/u/:id", checkPermission("EDIT_OPTIONS"), incidentTypeController.updateIncidentType);

router.delete("/:id", checkPermission("DELETE_OPTIONS"), incidentTypeController.deleteIncidentType);

module.exports = router;