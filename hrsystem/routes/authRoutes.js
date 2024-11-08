const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/auth");

router.post("/login", authController.login);

router.post("/logout", authController.logoutUser);

router.get('/get-name/:id', verifyToken, authController.getUserFirstandLastName);

router.post("/create-session", authController.createSessionToken);

router.post("/complete-registration", userController.completeRegistration);

router.post("/request-password-reset", authController.requestPasswordReset);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
