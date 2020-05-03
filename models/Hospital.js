const mongoose = require("mongoose");
const { Schema } = mongoose;

const hospitalSchema = new Schema({
	hospitalName: {
		type: String,
		required: true,
	},
	hospitalUsername: {
		type: String,
		required: true,
	},
	hospitalAddress: {
		type: String,
		required: true,
	},
	hospitalEmail: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	hospitalPhone: {
		type: String,
	},
});

mongoose.model("hospitals", hospitalSchema);
