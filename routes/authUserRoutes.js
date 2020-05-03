const passport = require("passport");

module.exports = (app) => {
	app.get(
		"/auth/user/google",
		passport.authenticate("google", { scope: ["profile", "email"] })
	);

	app.get(
		"/auth/user/google/callback",
		passport.authenticate("google"),
		(req, res) => {
			res.redirect("/api/user/current_user");
		}
	);

	app.get("/api/user/logout", (req, res) => {
		req.logout();
		res.redirect("/");
	});

	app.get("/api/user/current_user", (req, res) => {
		// Passport attaches user object in request body!
		res.send(req.user);
	});
};
