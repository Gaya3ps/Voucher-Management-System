const {
  insertVoucher,
  getAllVouchers,
  getAllVouchersPaginated,
} = require("../models/voucherModel");
const QRCode = require("qrcode");
const { getCurrentSettings } = require("./settingsController");

//  Render the dashboard
exports.getDashboard = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const { vouchers, totalCount } = await getAllVouchersPaginated(page, limit);
    const totalPages = Math.ceil(totalCount / limit);
    const successMessage = req.session.successMessage || null;
    req.session.successMessage = null;
    res.render("dashboard", {
      title: "Dashboard",
      vouchers,
      user: req.session.user,
      qrCodeImage: null,
      successMessage,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
};

// Generate QR Code and insert into the database
exports.generateQRCode = async (req, res) => {
  try {
    const settings = await getCurrentSettings();
    const voucherCode = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString(); // Generate 10-digit code
    const generatedDate = new Date();
    const expiryDate = new Date(generatedDate);
    expiryDate.setDate(expiryDate.getDate() + settings.max_expiry_days);
    if (isNaN(expiryDate.getTime())) {
      throw new Error(`Invalid expiry date: ${expiryDate}`);
    }
    const qrCodeImage = await QRCode.toDataURL(voucherCode);
    console.log("Inserting Voucher with:", {
      voucherCode,
      generatedDate,
      expiryDate,
      maxExpiryDays: settings.max_expiry_days,
      width: settings.width,
      height: settings.height,
      titleFontSize: settings.title_font_size,
      normalFontSize: settings.normal_font_size,
      voucherTitle: settings.voucher_title,
    });

    await insertVoucher(voucherCode, generatedDate, expiryDate, settings);

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const { vouchers, totalCount } = await getAllVouchersPaginated(page, limit);
    const totalPages = Math.ceil(totalCount / limit);
    res.render("dashboard", {
      title: "Dashboard",
      vouchers,
      user: req.session.user,
      qrCodeImage,
      latestVoucher: { voucher_code: voucherCode, generatedDate, expiryDate },
      successMessage: "QR Code generated and voucher saved successfully!",
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error generating QR Code:", error);
    res.status(500).send("Failed to generate QR Code");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Failed to log out");
    }
    res.redirect("/login");
  });
};
