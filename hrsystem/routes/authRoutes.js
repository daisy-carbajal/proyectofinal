const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/auth");
const { checkPermission } = require("../middlewares/checkRolePermission");

router.post("/login", authController.login);

router.post("/logout", authController.logoutUser);

router.get('/get-name/:id', verifyToken, checkPermission("VIEW_USER"), authController.getUserFirstandLastName);

router.post("/create-session", authController.createSessionToken);

router.post("/complete-registration", userController.completeRegistration);

router.post("/request-password-reset", authController.requestPasswordReset);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
