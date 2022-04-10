const router = require("express").Router();
const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  }),
  function (req, res) {
    res.send("Logging in with Google");
  }
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  function (req, res) {
    console.log("Redirecting to /profile/");
    res.redirect("/profile/");
  }
);

module.exports = router;
