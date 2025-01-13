const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");

// Export voucher as PDF
router.get("/voucher/export-pdf", voucherController.exportVoucherPDF);

module.exports = router;
