const bcrypt = require("bcrypt");
const passport = require("passport");
const mongoose = require("mongoose");
const Hospital = mongoose.model("hospitals");

module.exports = (app) => {
	app.post("/auth/hospital/registration", async (req, res) => {
		const hospitalData = {
			hospitalName: req.body.hospitalName,
			hospitalUsername: req.body.hospitalUsername,
			hospitalAddress: req.body.hospitalAddress,
			hospitalEmail: req.body.hospitalEmail,
			hospitalPhone: req.body.hospitalPhone,
			password: req.body.password,
		};

		const existingHospital = await Hospital.findOne({
			hospitalUsername: req.body.hospitalUsername,
		});

		// If hospital doesn't exist in database
		if (!existingHospital) {
			bcrypt.hash(req.body.password, 10, async (err, hash) => {
				hospitalData.password = hash;

				const newHospital = await Hospital.create(hospitalData, (err) => {
					// if there is error, send error
					if (err) {
						res.send({ err });
					}
				});

				res.json({ status: req.body.hospitalUsername + " registered!" });
			});
		} else {
			res.json({ error: "Hospital already exists" });
		}
	});

	app.post(
		"/hospital/login",
		passport.authenticate("local", { failureRedirect: "/login" }),
		(req, res) => {
			res.redirect("/api/current_hospital");
		}
	);

	app.get("/api/current_hospital", (req, res) => {
		res.send(req.user);
	});
};
