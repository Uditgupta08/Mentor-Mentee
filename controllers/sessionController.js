// controllers/sessionController.js
const Session = require("../models/session");
const { requireRole } = require("../middleware/authMiddleware");

// GET /sessions
// If mentor: returns sessions where mentorId = current user
// If mentee: where menteeId = current user
const listMySessions = async (req, res) => {
	try {
		const where =
			req.user.role === "mentor"
				? { mentorId: req.user.id }
				: { menteeId: req.user.id };

		const sessions = await Session.findAll({
			where,
			order: [["scheduledTime", "ASC"]],
		});
		res.json(sessions);
	} catch (err) {
		console.error("listMySessions:", err);
		res.status(500).json({ error: "Could not fetch sessions." });
	}
};

module.exports = { listMySessions };
