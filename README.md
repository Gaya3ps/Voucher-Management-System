# Voucher Management System

A Voucher Management System built using Node.js, Express, and MSSQL. This application allows users to generate vouchers, view and export voucher PDFs, and manage system settings.

## Features
- User authentication (login/logout)
- Generate QR code vouchers
- Export vouchers as PDF
- Manage voucher settings (title, expiry date, dimensions, etc.)
- Pagination for listing vouchers
- Middleware to protect routes (requires login)

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MSSQL (SQL Server)
- **Templating Engine**: EJS
- **Styling**: Inline CSS, FontAwesome
- **Session Management**: express-session

## Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Navigate into the project directory:
   ```bash
   cd <project-folder>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and provide your database configuration:
   ```
   DB_USER=your_db_username
   DB_PASS=your_db_password
   DB_NAME=voucher_management
   SESSION_SECRET=your_secret_key
   DB_HOST=your_db_host
   DB_TRUST_CERTIFICATE=true

   ```
5. Start the server:
   ```bash
   npm run dev

   ```


## Future Enhancements
- Add user registration
- Implement forgot password feature
- Enhance styling with a responsive design



