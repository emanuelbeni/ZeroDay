const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
require("./models/User");
require("./services/passport");

// Connect to mongoDB
mongoose.connect(keys.mongoURI, () => {
	console.log("Database Connected");
});

// Initialize app
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(
	cookieSession({
		name: "session",
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieSessionKey],
	})
);
app.use(passport.initialize());
app.use(passport.session());

// Importing routes
require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
