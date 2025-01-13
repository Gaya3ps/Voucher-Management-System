const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/settings",
  authMiddleware.isLoggedIn,
  settingsController.getSettings
);
router.post(
  "/settings",
  authMiddleware.isLoggedIn,
  settingsController.updateSettings
);

module.exports = router;
