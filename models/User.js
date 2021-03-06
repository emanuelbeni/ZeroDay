const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	googleId: String,
	displayName: String,
	email: {
		type: String,
		required: true,
	},
});

mongoose.model("users", userSchema);
