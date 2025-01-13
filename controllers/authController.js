// Render the login page
exports.getLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.render("login", { title: "Login", error: null });
};

// Handle user login
exports.postLogin = (req, res) => {
  const { username, password } = req.body;

  // Hardcoded username and password
  const hardcodedUsername = "admin";
  const hardcodedPassword = "admin123";

  if (username === hardcodedUsername && password === hardcodedPassword) {
    req.session.user = { username };
    res.redirect("/dashboard");
  } else {
    console.log("login incredentials failed");
    
    res.render("login", { error: "Invalid username or password" });
  }
};

// Handle user logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
