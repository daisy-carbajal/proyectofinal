const express = require("express");
const router = express.Router();
const typeFeedbackController = require("../controllers/typeFeedbackController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.post("/", checkPermission("CREATE_OPTIONS"), typeFeedbackController.createTypeFeedback);

router.get("/", checkPermission("VIEW_OPTIONS"), typeFeedbackController.getAllTypeFeedbacks);

router.get("/:id", checkPermission("VIEW_OPTIONS"), typeFeedbackController.getTypeFeedbackById);

router.put("/:id", checkPermission("EDIT_OPTIONS"), typeFeedbackController.updateTypeFeedback);

router.delete("/:id", checkPermission("DELETE_OPTIONS"), typeFeedbackController.deleteTypeFeedback);

module.exports = router;