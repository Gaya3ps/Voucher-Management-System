const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const { getCurrentSettings } = require("../controllers/settingsController");
const { getVoucherByCode } = require("../models/voucherModel");

exports.exportVoucherPDF = async (req, res) => {
  try {
    const { voucher_code } = req.query;

    if (!voucher_code) {
      return res.status(400).send("Voucher code is required");
    }

    const [settings, voucher] = await Promise.all([
      getCurrentSettings(),
      getVoucherByCode(voucher_code),
    ]);

    if (!settings || !voucher) {
      return res.status(404).send("Settings or voucher not found");
    }

    const width = Math.max(parseInt(settings.width, 10) || 210, 150);
    const height = Math.max(parseInt(settings.height, 10) || 297, 200);
    const titleFontSize = Math.max(
      parseInt(settings.title_font_size, 10) || 24,
      20
    );
    const normalFontSize = Math.max(
      parseInt(settings.normal_font_size, 10) || 12,
      10
    );

    const ptsPerMM = 2.83465;
    const pageWidth = width * ptsPerMM;
    const pageHeight = height * ptsPerMM;

    const doc = new PDFDocument({
      size: [pageWidth, pageHeight],
      margins: {
        top: pageHeight * 0.12,
        bottom: pageHeight * 0.1,
        left: pageWidth * 0.1,
        right: pageWidth * 0.1,
      },
      info: {
        Title: `Voucher ${voucher_code}`,
        Author: "Voucher Management System",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=voucher-${voucher_code}.pdf`
    );
    doc.pipe(res);

    const usableWidth = pageWidth * 0.8;
    const centerX = (pageWidth - usableWidth) / 2;
    let currentY = doc.page.margins.top;

    doc
      .rect(
        centerX - 10,
        currentY - 10,
        usableWidth + 20,
        pageHeight * 0.8 + 20
      )
      .lineWidth(3)
      .stroke("#004aad");

    currentY += 20;

    doc
      .font("Helvetica-Bold")
      .fontSize(titleFontSize)
      .fillColor("#004aad")
      .text(settings.voucher_title || "GIFT VOUCHER", centerX, currentY, {
        align: "center",
        width: usableWidth,
      });

    currentY += titleFontSize + 30;

    // Add QR Code
    const qrCodeSize = Math.min(usableWidth, pageHeight * 0.3);
    const qrCodeX = (pageWidth - qrCodeSize) / 2;

    const qrCodeImage = await QRCode.toDataURL(voucher_code, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: qrCodeSize,
    });

    doc.image(qrCodeImage, qrCodeX, currentY, {
      width: qrCodeSize,
      height: qrCodeSize,
    });

    currentY += qrCodeSize + 40;

    // Voucher Details Section
    const centerDetailRow = (label, value) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(normalFontSize)
        .fillColor("#333")
        .text(label, centerX, currentY, {
          align: "center",
          width: usableWidth,
        });
      currentY += normalFontSize + 5;
      doc
        .font("Helvetica")
        .fontSize(normalFontSize)
        .text(value, centerX, currentY, {
          align: "center",
          width: usableWidth,
        });
      currentY += normalFontSize + 15;
    };

    centerDetailRow("Voucher Code", voucher.voucher_code);
    centerDetailRow(
      "Generated Date",
      new Date(voucher.generated_date).toLocaleDateString()
    );
    centerDetailRow(
      "Expiry Date",
      new Date(voucher.expiry_date).toLocaleDateString()
    );

    // Footer
    doc
      .fontSize(normalFontSize - 2)
      .moveDown(2)
      .text("This voucher is subject to terms and conditions.", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send(`Error generating PDF: ${error.message}`);
  }
};
