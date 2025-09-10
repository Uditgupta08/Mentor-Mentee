// controllers/mentorshipRequestController.js
const { Op } = require("sequelize");
const { Session, MentorshipRequest, User, Role } = require("../models");
const { parseTimeToMinutes } = require("./availabilityController");

// Mentee sends a new mentorship request
// POST /requests
// body: { mentorId, message? }
const sendRequest = async (req, res) => {
	try {
		if (!req.user || !req.user.id) {
			return res.status(401).json({ error: "Not authenticated." });
		}

		// Normalize role name (handles string or object)
		const roleName =
			typeof req.user.role === "string"
				? req.user.role
				: req.user.role && req.user.role.name
				? req.user.role.name
				: null;

		// Only mentees should be allowed to send requests
		if (String(roleName).toLowerCase() !== "mentee") {
			return res
				.status(403)
				.json({ error: "Only mentees can send mentorship requests." });
		}

		const menteeId = req.user.id;
		const { mentorId, message } = req.body;

		if (!mentorId) {
			return res.status(400).json({ error: "mentorId is required." });
		}

		// Prevent asking self (extra safety)
		if (String(mentorId) === String(menteeId)) {
			return res
				.status(400)
				.json({ error: "You cannot send a request to yourself." });
		}

		// Validate mentor exists and has role 'mentor'
		const mentor = await User.findByPk(mentorId, {
			include: { model: Role, as: "role" },
		});
		if (!mentor) return res.status(404).json({ error: "Mentor not found." });
		const mentorRoleName =
			typeof mentor.role === "string" ? mentor.role : mentor.role?.name;
		if (String(mentorRoleName).toLowerCase() !== "mentor") {
			return res.status(400).json({ error: "Specified user is not a mentor." });
		}

		// prevent duplicate pending requests
		const existing = await MentorshipRequest.findOne({
			where: { mentorId, menteeId, status: "PENDING" },
		});
		if (existing) {
			return res.status(400).json({ error: "Request already pending." });
		}

		const reqRecord = await MentorshipRequest.create({
			mentorId,
			menteeId,
			message: message || null,
		});

		return res.status(201).json({ request: reqRecord });
	} catch (err) {
		console.error("sendRequest:", err);
		return res.status(500).json({ error: "Could not send request." });
	}
};

// Mentor accepts or rejects a request
// PATCH /requests/:id/respond
// body: { status: "ACCEPTED"|"REJECTED", scheduledTime?, duration?, comments?, topic? }
const respondRequest = [
	// route should apply authorizeRole("mentor") middleware
	async (req, res) => {
		try {
			const { id } = req.params;
			const { status, scheduledTime, duration, comments, topic } = req.body;

			// fetch the request, ensure it’s addressed to this mentor
			const reqRec = await MentorshipRequest.findByPk(id);
			if (!reqRec || String(reqRec.mentorId) !== String(req.user.id)) {
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
					return res.status(400).json({
						error: "scheduledTime & duration required to create session.",
					});
				}
				const startTime = new Date(scheduledTime);
				const endTime = new Date(startTime.getTime() + duration * 60000);

				// check if mentor already has a conflicting session
				const conflict = await Session.findOne({
					where: {
						mentorId: req.user.id,
						status: "SCHEDULED",
						[Op.or]: [
							{
								scheduledTime: {
									[Op.between]: [startTime, endTime],
								},
							},
							{
								scheduledTime: { [Op.lte]: startTime },
								endTime: { [Op.gte]: startTime },
							},
						],
					},
				});

				if (conflict) {
					return res
						.status(400)
						.json({ error: "Mentor is not available at this timeslot." });
				}

				// create the session
				session = await Session.create({
					mentorId: req.user.id,
					menteeId: reqRec.menteeId,
					scheduledTime: startTime,
					endTime, // <-- add endTime column in Session model if not already
					duration,
					comments: comments || null,
					topic: topic || null,
					status: "SCHEDULED",
				});
			}

			return res.json({ request: reqRec, session });
		} catch (err) {
			console.error("respondRequest:", err);
			return res.status(500).json({ error: "Could not respond to request." });
		}
	},
];

module.exports = {
	sendRequest,
	respondRequest,
};
