const express = require("express");
const ejs = require("ejs");
const app = express();
const authRoutes = require("./routes/google-auth");
const profileRoutes = require("./routes/profile-route");
const passportSetup = require("./configs/passport-setup");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const creds = require("./configs/keys");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(function (req, res, next) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [creds.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(authRoutes);
app.use(profileRoutes);

mongoose.connect("mongodb://localhost:27017/oauth-tutorial", function () {
  console.log("Connected to MongoDB!");
});

app.listen(3000, function () {
  console.log("Server started on port 3000!");
});

const authCheck = (req, res, next) => {
  if (req.user != undefined) {
    //not logged in
    res.redirect("/loggedin-home/");
  } else {
    //logged in
    next();
  }
};
app.get("/", authCheck, function (req, res) {
  res.render("index");
});
