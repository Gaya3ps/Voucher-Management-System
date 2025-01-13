const { sql ,db } = require("../config/dbConfig");

// Model to insert a new voucher into the database
const insertVoucher = async (
  voucherCode,
  generatedDate,
  expiryDate,
  settings
) => {
  if (
    !generatedDate ||
    !expiryDate ||
    isNaN(generatedDate.getTime()) ||
    isNaN(expiryDate.getTime())
  ) {
    throw new Error("Invalid date values provided for SQL insertion");
  }
  const request = new sql.Request();
  return await request
    .input("voucher_code", sql.NVarChar, voucherCode)
    .input("generated_date", sql.DateTime, generatedDate)
    .input("expiry_date", sql.DateTime, expiryDate)
    .input("max_expiry_days", sql.Int, settings.max_expiry_days)
    .input("width", sql.Int, settings.width)
    .input("height", sql.Int, settings.height)
    .input("title_font_size", sql.Int, settings.title_font_size)
    .input("normal_font_size", sql.Int, settings.normal_font_size)
    .input("voucher_title", sql.NVarChar, settings.voucher_title).query(`
      INSERT INTO Vouchers 
      (voucher_code, generated_date, expiry_date, max_expiry_days, width, height, title_font_size, normal_font_size, voucher_title)
      VALUES 
      (@voucher_code, @generated_date, @expiry_date, @max_expiry_days, @width, @height, @title_font_size, @normal_font_size, @voucher_title)
    `);
};

// Model to get all vouchers from the database
const getAllVouchers = async () => {
  const request = new sql.Request();
  const result = await request.query("SELECT * FROM Vouchers");
  return result.recordset; // Return array of voucher records
};
const getAllVouchersPaginated = async (page, limit) => {
  const offset = (page - 1) * limit;
  const pool = await sql.connect(db); // Assuming you have an established SQL connection

  const result = await pool
    .request()
    .input("limit", sql.Int, limit)
    .input("offset", sql.Int, offset).query(`
      SELECT * FROM Vouchers
      ORDER BY generated_date DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY;

      SELECT COUNT(*) AS totalCount FROM Vouchers; -- To get total number of records
    `);

  return {
    vouchers: result.recordsets[0], // Vouchers list
    totalCount: result.recordsets[1][0].totalCount, // Total vouchers count
  };
};

const getVoucherByCode = async (voucherCode) => {
  const request = new sql.Request();
  const result = await request
    .input("voucher_code", sql.NVarChar, voucherCode)
    .query("SELECT * FROM Vouchers WHERE voucher_code = @voucher_code");
  return result.recordset[0]; // Return the first voucher
};

module.exports = {
  insertVoucher,
  getAllVouchers,
  getVoucherByCode,
  getAllVouchersPaginated
};
