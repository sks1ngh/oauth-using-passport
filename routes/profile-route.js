const router = require("express").Router();

const authCheck = (req, res, next) => {
  if (req.user === undefined) {
    //not logged in
    res.redirect("/");
  } else {
    //logged in
    next();
  }
};

router.get("/profile/", authCheck, function (req, res) {
  res.render("profile", { username: req.user.username });
});

router.get("/loggedin-home", authCheck, function (req, res) {
  res.render("loggedin-home", { username: req.user.username });
});

router.get("/logout", authCheck, function (req, res) {
  req.logout();
  res.redirect("/profile/");
});

module.exports = router;
