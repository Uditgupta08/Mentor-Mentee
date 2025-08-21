// controllers/sessionController.js
const { Session } = require("../models");

// GET /sessions
// If mentor: returns sessions where mentorId = current user
// If mentee: where menteeId = current user
const listMySessions = async (req, res) => {
	try {
		const roleName =
			typeof req.user.role === "string"
				? req.user.role
				: req.user.role && req.user.role.name
				? req.user.role.name
				: null;

		const where =
			String(roleName).toLowerCase() === "mentor"
				? { mentorId: req.user.id }
				: { menteeId: req.user.id };

		const sessions = await Session.findAll({
			where,
			order: [["scheduledTime", "ASC"]],
		});
		return res.json({ sessions });
	} catch (err) {
		console.error("listMySessions:", err);
		return res.status(500).json({ error: "Could not fetch sessions." });
	}
};

module.exports = { listMySessions };
