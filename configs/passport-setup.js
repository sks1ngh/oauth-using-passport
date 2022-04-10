const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const creds = require("./keys");
const User = require("../mongo_model/mongo-setup");

passport.serializeUser((user, done) => {
  console.log("Serialiazing User. User object contains :- " + user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    console.log("Deserialiazing user :- ", id);
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for strategy
      callbackURL: "/auth/google/redirect",
      clientID: creds.oauthClientId,
      clientSecret: creds.oauthSecrets,
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback function
      //check if user already exists
      User.findOne({ googleID: profile.id }).then((existingUser) => {
        if (existingUser) {
          //   console.log("User alread exists!", existingUser);
          done(null, existingUser);
        } else {
          new User({
            username: profile.displayName,
            googleID: profile.id,
          })
            .save()
            .then((newUser) => {
              //   console.log("New User :- ", newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
