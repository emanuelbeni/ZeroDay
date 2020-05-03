const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Hospital = mongoose.model("hospitals");

module.exports = (app) => {
	// !!ERRROR!! - BODY is not present
	app.post("/auth/hospital/registration", async (req, res) => {
		const hospitalData = {
			hospitalName: req.body.hospitalName,
			hospitalAddress: req.body.hospitalAddress,
			hospitalEmail: req.body.hospitalEmail,
			hospitalPhone: req.body.hospitalPhone,
			password: req.body.password,
		};

		const existingHospital = await Hospital.findOne({
			hospitalEmail: req.body.hospitalEmail,
		});

		// If hospital doesn't exist in database
		if (!existingHospital) {
			bcrypt.hash(req.body.password, 10, async (err, hash) => {
				hospitalData.password = hash;

				const newHospital = await Hospital.create(hospitalData, (err) => {
					// if there is error, send error
					if (err) {
						res.send("error: " + err);
					}
				});

				res.json({ status: newHospital.hospitalEmail + " registered!" });
			});
		}
		res.json({ error: "Hospital already exists" });
	});
};
