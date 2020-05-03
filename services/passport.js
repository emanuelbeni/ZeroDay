const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");
const bcrypt = require("bcrypt");

const Hospital = mongoose.model("hospitals");
const User = mongoose.model("users");

// Setting Strategies

// Google OAuth 2.0 - User Side
passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientId,
			clientSecret: keys.googleClientSecret,
			callbackURL: "/auth/user/google/callback",
			proxy: true,
		},
		async (accessToken, refreshToken, profile, done) => {
			const existingUser = await User.findOne({
				googleId: profile.id,
			});

			console.log(profile);
			// If user doesn't exist in our DB
			if (!existingUser) {
				const newUser = await new User({
					googleId: profile.id,
					displayName: profile.displayName,
					email: profile.emails[0].value,
				}).save();
				return done(null, newUser);
			}

			done(null, existingUser);
		}
	)
);

// Passport local Strategies - Hospital side
passport.use(
	new LocalStrategy(async (username, password, done) => {
		const existingHospital = await Hospital.findOne({
			hospitalUsername: username,
		});

		console.log(existingHospital);

		// Hospital doesnt exist
		if (!existingHospital) {
			return done(null, false);
		}

		// Use bcrypt to 'dehash' and compare with password entered
		bcrypt.compare(password, existingHospital.password, (err, result) => {
			if (err) throw err;
			// Hash and password entered is same
			if (!result) {
				// Password doesnt match
				return done(null, false);
			}

			// Password and username match
			return done(null, existingHospital);
		});
	})
);

// Passport serialize and deserialize function
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});
