// routes/roleRoutes.js
const express = require("express");
const router = express.Router();
const { Role } = require("../models");

// POST /roles
// Body: { name: string, description?: string }

// mentee, mentor, superadmin, admin, corporate
router.post("/", async (req, res) => {
	const { name, description } = req.body;
	if (!name) {
		return res.status(400).json({ message: "Role name is required" });
	}
	try {
		const [role, created] = await Role.findOrCreate({
			where: { name },
			defaults: { description },
		});
		if (!created) {
			return res.status(409).json({ message: "Role already exists" });
		}
		return res.status(201).json(role);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
