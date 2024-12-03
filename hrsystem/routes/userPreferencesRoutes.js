const express = require("express");
const router = express.Router();
const userPreferencesController = require("../controllers/userPreferencesController");

router.post("/", userPreferencesController.setPreferences);

router.get("/:id", userPreferencesController.getUserPreferences);

module.exports = router;