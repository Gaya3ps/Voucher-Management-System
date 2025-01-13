const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/", authController.getLoginPage);
router.post("/", authController.postLogin);
router.get("/logout", authController.logout);

module.exports = router;
