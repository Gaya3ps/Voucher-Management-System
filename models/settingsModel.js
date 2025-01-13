const { sql } = require('../config/dbConfig');

// Get settings from the database
const getSettingsFromDB = async () => {
  const request = new sql.Request();
  const result = await request.query(`
    SELECT TOP 1 
      id,
      max_expiry_days AS max_expiry_days,  
      width,
      height,
      title_font_size AS title_font_size,
      normal_font_size AS normal_font_size,
      voucher_title AS voucher_title
    FROM Settings
  `);
  console.log('Fetched Settings:', result.recordset[0]);
  return result.recordset[0];
};


// Save or update settings in the database
const saveSettingsToDB = async (settings) => {
  const request = new sql.Request();
  await request
    .input('voucherTitle', sql.NVarChar, settings.voucherTitle)
    .input('max_expiry_days', sql.Int, settings.maxExpiryDays)
    .input('width', sql.Int, settings.width)
    .input('height', sql.Int, settings.height)
    .input('title_font_size', sql.Int, settings.titleFontSize)
    .input('normal_font_size', sql.Int, settings.normalFontSize)
    .query(`
      IF EXISTS (SELECT * FROM Settings)
      BEGIN
        UPDATE Settings SET 
          voucher_title = @voucherTitle,
          max_expiry_days = @max_expiry_days, 
          width = @width, 
          height = @height, 
          title_font_size = @title_font_size, 
          normal_font_size = @normal_font_size
      END
      ELSE
      BEGIN
        INSERT INTO Settings (voucher_title, max_expiry_days, width, height, title_font_size, normal_font_size)
        VALUES (@voucherTitle, @max_expiry_days, @width, @height, @title_font_size, @normal_font_size)
      END
    `);
};

module.exports = {
  getSettingsFromDB,
  saveSettingsToDB,
};
