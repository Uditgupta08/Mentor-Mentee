// controllers/dashboardController.js
const { Op, Sequelize } = require("sequelize");
const {
	User,
	Session,
	MentorProfile,
	MenteeProfile,
	MentorshipRequest,
} = require("../models");

/**
 * GET /api/dashboard
 * Protected route - expects req.user to be set by your auth middleware
 */
const getDashboard = async (req, res) => {
	try {
		if (!req.user || !req.user.id) {
			return res.status(401).json({ message: "Not authenticated" });
		}

		const user = req.user; // your auth middleware should include Role as user.role

		// choose case-insensitive LIKE operator depending on dialect
		// (Postgres supports iLike, MySQL uses LIKE)
		const dialect = Session.sequelize?.getDialect?.() || "mysql";
		const likeOp = dialect === "postgres" ? Op.iLike : Op.like;

		// 1) total sessions (mentor or mentee)
		const totalSessions = await Session.count({
			where: {
				[Op.or]: [{ mentorId: user.id }, { menteeId: user.id }],
			},
		});

		// 2) feedbackRating
		let feedbackRating = 0;
		const userRoleName =
			user.role && user.role.name ? user.role.name.toLowerCase() : null;

		if (userRoleName === "mentor") {
			// use MentorProfile.rating if present
			const mp = await MentorProfile.findOne({ where: { userId: user.id } });
			feedbackRating = mp?.rating ?? 0;
		} else {
			// for mentee: compute average of feedbackRating from their completed sessions (if recorded)
			const ratings = await Session.findAll({
				where: {
					menteeId: user.id,
					status: "COMPLETED",
					feedbackRating: { [Op.ne]: null },
				},
				attributes: ["feedbackRating"],
			});
			if (ratings.length) {
				const sum = ratings.reduce((s, r) => s + (r.feedbackRating ?? 0), 0);
				feedbackRating = sum / ratings.length;
			} else {
				feedbackRating = 0;
			}
		}

		// 3) resumeReviews - sessions whose topic or comments contain 'resume'
		const resumeWhere = {
			[Op.and]: [
				{
					[Op.or]: [
						{ topic: { [likeOp]: "%resume%" } },
						{ comments: { [likeOp]: "%resume%" } },
					],
				},
				{
					[Op.or]: [{ mentorId: user.id }, { menteeId: user.id }],
				},
			],
		};

		const resumeReviews = await Session.count({ where: resumeWhere });

		// 4) upcomingSessions (next 10)
		const now = new Date();
		const upcomingSessionsRaw = await Session.findAll({
			where: {
				[Op.and]: [
					{
						[Op.or]: [{ mentorId: user.id }, { menteeId: user.id }],
					},
					{ scheduledTime: { [Op.gt]: now } },
				],
			},
			include: [
				{
					model: User,
					as: "Mentor",
					attributes: ["id", "firstname", "lastname"],
				},
				{
					model: User,
					as: "Mentee",
					attributes: ["id", "firstname", "lastname"],
				},
			],
			order: [["scheduledTime", "ASC"]],
			limit: 10,
		});

		const upcomingSessions = upcomingSessionsRaw.map((s) => {
			const mentor = s.Mentor ?? null;
			const mentee = s.Mentee ?? null;
			let counterpartyName = "";
			if (mentor && user.id === mentor.id) {
				counterpartyName = mentee
					? `${mentee.firstname} ${mentee.lastname}`
					: "";
			} else {
				counterpartyName = mentor
					? `${mentor.firstname} ${mentor.lastname}`
					: "";
			}
			return {
				id: s.id,
				title: s.topic ? s.topic : `Session ${s.id}`,
				scheduledTime: s.scheduledTime,
				topic: s.topic ?? s.comments ?? "",
				status: s.status,
				counterpartyName,
			};
		});

		// 5) notifications - upcoming sessions within next 48 hours and pending requests
		const in48h = new Date(Date.now() + 48 * 60 * 60 * 1000);
		const imminent = upcomingSessionsRaw
			.filter((s) => s.scheduledTime && new Date(s.scheduledTime) <= in48h)
			.map(
				(s) =>
					`Upcoming: ${s.topic ?? `Session ${s.id}`} on ${new Date(
						s.scheduledTime
					).toLocaleString()}`
			);

		const pendingRequests = await MentorshipRequest.count({
			where: {
				[Op.or]: [{ mentorId: user.id }, { menteeId: user.id }],
				status: "PENDING",
			},
		});
		const pendingMessage = pendingRequests
			? [`You have ${pendingRequests} pending mentorship request(s)`]
			: [];

		const notifications = [...imminent, ...pendingMessage];

		const stats = {
			totalSessions,
			feedbackRating: Number((feedbackRating ?? 0).toFixed(2)),
			resumeReviews,
			upcomingSessions,
			notifications,
		};

		// send sanitized user
		const safeUser = {
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email,
			role: user.role ? { id: user.role.id, name: user.role.name } : null,
		};

		return res.json({ user: safeUser, stats });
	} catch (err) {
		console.error("getDashboard error:", err);
		return res.status(500).json({ message: "Server error" });
	}
};

module.exports = {
	getDashboard,
};
