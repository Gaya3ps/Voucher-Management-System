require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const { connectDB } = require("./config/dbConfig");

// Import routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const voucherRoutes = require("./routes/voucherRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Set EJS as the view engine
app.set("view engine", "ejs");

// Routes
app.use("/login", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", settingsRoutes);
app.use("/", voucherRoutes);

// Default route (redirect to login)
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
