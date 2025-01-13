const {
  getSettingsFromDB,
  saveSettingsToDB,
} = require("../models/settingsModel");

// Render the settings page
exports.getSettings = async (req, res) => {
  try {
    let settings = await getSettingsFromDB(); // Fetch settings from DB
    if (!settings) {
      // Default settings if none exist in DB
      // settings = {
      //   voucherTitle: 'Default Voucher Title',
      //   maxExpiryDays: 30,
      //   width: 210,
      //   height: 297,
      //   titleFontSize: 20,
      //   normalFontSize: 12,
      // };
      console.log("no settings");
    }
    const successMessage = req.query.success
      ? "Settings updated successfully!"
      : null; // Check for success flag
    res.render("settings", {
      title: "Settings Page",
      settings,
      successMessage,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).send("Error loading settings");
  }
};

// Update settings in the database
exports.updateSettings = async (req, res) => {
  const {
    voucherTitle,
    maxExpiryDays,
    width,
    height,
    titleFontSize,
    normalFontSize,
  } = req.body;

  const newSettings = {
    voucherTitle,
    maxExpiryDays: parseInt(maxExpiryDays),
    width: parseInt(width),
    height: parseInt(height),
    titleFontSize: parseInt(titleFontSize),
    normalFontSize: parseInt(normalFontSize),
  };

  try {
    await saveSettingsToDB(newSettings);
    console.log("Settings updated:", newSettings);
    // res.redirect('/settings?success=true');
    req.session.successMessage = "Settings updated successfully!";
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).send("Error updating settings");
  }
};

// Export the current settings for PDF generation
exports.getCurrentSettings = async () => {
  const settings = await getSettingsFromDB();
  return (
    settings || {
      maxExpiryDays: 30,
      width: 210,
      height: 297,
      titleFontSize: 20,
      normalFontSize: 12,
    }
  );
};
