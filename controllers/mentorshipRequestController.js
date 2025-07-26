// controllers/mentorshipRequestController.js
const { Op } = require("sequelize");
const MentorshipRequest = require("../models/mentorshipRequest");
const Session = require("../models/session");
const { requireRole } = require("../middleware/authMiddleware");

// Mentee sends a new mentorship request
// POST /requests
// body: { mentorId }
const sendRequest = async (req, res) => {
	try {
		const menteeId = req.user.id;
		const { mentorId } = req.body;

		// prevent duplicate pending requests
		const existing = await MentorshipRequest.findOne({
			where: { mentorId, menteeId, status: "PENDING" },
		});
		if (existing) {
			return res.status(400).json({ error: "Request already pending." });
		}

		const reqRecord = await MentorshipRequest.create({ mentorId, menteeId });
		res.status(201).json(reqRecord);
	} catch (err) {
		console.error("sendRequest:", err);
		res.status(500).json({ error: "Could not send request." });
	}
};

// Mentor accepts or rejects a request
// PATCH /requests/:id/respond
// body: { status: "ACCEPTED"|"REJECTED", scheduledTime?, duration?, comments? }
const respondRequest = [
	requireRole("mentor"),
	async (req, res) => {
		try {
			const { id } = req.params;
			const { status, scheduledTime, duration, comments } = req.body;

			// fetch the request, ensure it’s addressed to this mentor
			const reqRec = await MentorshipRequest.findByPk(id);
			if (!reqRec || reqRec.mentorId !== req.user.id) {
				return res.status(404).json({ error: "Request not found." });
			}
			if (!["ACCEPTED", "REJECTED"].includes(status)) {
				return res.status(400).json({ error: "Invalid status." });
			}

			// update the request status
			reqRec.status = status;
			await reqRec.save();

			// if accepted, create a Session
			let session = null;
			if (status === "ACCEPTED") {
				if (!scheduledTime || !duration) {
					return res
						.status(400)
						.json({
							error: "scheduledTime & duration required to create session.",
						});
				}
				session = await Session.create({
					mentorId: req.user.id,
					menteeId: reqRec.menteeId,
					scheduledTime: new Date(scheduledTime),
					duration,
					comments: comments || null,
				});
			}

			res.json({ request: reqRec, session });
		} catch (err) {
			console.error("respondRequest:", err);
			res.status(500).json({ error: "Could not respond to request." });
		}
	},
];

module.exports = { sendRequest, respondRequest };
