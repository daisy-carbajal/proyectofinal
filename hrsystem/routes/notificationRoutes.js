const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.use(verifyToken);

router.get("/:id", notificationController.getNotifications);

router.patch("/read/:id", notificationController.markNotificationAsRead);

router.delete("/:id", checkPermission("DELETE_NOTIFICATIONS"), notificationController.deleteNotification);

module.exports = router;