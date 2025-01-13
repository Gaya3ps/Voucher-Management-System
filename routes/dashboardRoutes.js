const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");
router.get(
  "/dashboard",
  authMiddleware.isLoggedIn,
  dashboardController.getDashboard
);
router.post(
  "/dashboard/generate-qr",
  authMiddleware.isLoggedIn,
  dashboardController.generateQRCode
);
router.get("/logout", dashboardController.logout);

module.exports = router;
