const express = require("express");
const router = express.Router();
const incidentController = require("../controllers/incidentController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_INCIDENT"), incidentController.createIncident);

router.get("/", checkPermission("VIEW_INCIDENT"), incidentController.getAllIncidents);

router.get("/:id", checkPermission("VIEW_INCIDENT"), incidentController.getIncidentByUserId);

router.put("/u/:id", checkPermission("EDIT_INCIDENT"), incidentController.updateIncident);

router.delete("/:id", checkPermission("DELETE_INCIDENT"), incidentController.deleteIncident);

module.exports = router;