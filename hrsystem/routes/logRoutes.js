const express = require("express");
const logger = require("./../logger");
const router = express.Router();

router.post("/", (req, res) => {
  const { message, level = "info", timestamp } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  logger.log({ level, message, timestamp });
  res.json({ success: true });
});

module.exports = router;