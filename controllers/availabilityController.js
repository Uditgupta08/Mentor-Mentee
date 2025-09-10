// controllers/availabilityController.js
const { MentorAvailability } = require("../models");

/**
 * Helper: parse "HH:mm" or "HH:mm:ss" -> minutes since midnight
 */
function parseTimeToMinutes(t) {
	if (!t) return null;
	const parts = t.split(":").map((p) => Number(p));
	const hh = Number(parts[0] || 0);
	const mm = Number(parts[1] || 0);
	return hh * 60 + mm;
}

/**
 * Expand availabilities to concrete date slots between fromDate and toDate (inclusive).
 * from/to should be 'YYYY-MM-DD' strings.
 * Returns array of { availabilityId, date, startTime, endTime, timezone } sorted by date/time.
 */
const expandAvailabilitiesToSlots = (
	availabilities,
	fromDateStr,
	toDateStr
) => {
	const slots = [];
	const from = new Date(fromDateStr + "T00:00:00");
	const to = new Date(toDateStr + "T00:00:00");

	for (const a of availabilities) {
		if (!a.isActive) continue;

		if (a.recurrenceType === "weekly") {
			if (typeof a.dayOfWeek !== "number") continue;
			const windowStart = a.startDate
				? new Date(a.startDate + "T00:00:00")
				: from;
			const windowEnd = a.endDate ? new Date(a.endDate + "T00:00:00") : to;

			for (
				let d = new Date(windowStart);
				d <= windowEnd;
				d.setDate(d.getDate() + 1)
			) {
				if (d >= from && d <= to && d.getDay() === a.dayOfWeek) {
					slots.push({
						availabilityId: a.id,
						date: d.toISOString().slice(0, 10),
						startTime: a.startTime,
						endTime: a.endTime,
						timezone: a.timezone || null,
					});
				}
			}
		} else if (a.recurrenceType === "daily") {
			const windowStart = a.startDate
				? new Date(a.startDate + "T00:00:00")
				: from;
			const windowEnd = a.endDate ? new Date(a.endDate + "T00:00:00") : to;

			for (
				let d = new Date(windowStart);
				d <= windowEnd;
				d.setDate(d.getDate() + 1)
			) {
				if (d >= from && d <= to) {
					slots.push({
						availabilityId: a.id,
						date: d.toISOString().slice(0, 10),
						startTime: a.startTime,
						endTime: a.endTime,
						timezone: a.timezone || null,
					});
				}
			}
		} else if (a.recurrenceType === "one-off") {
			if (a.date) {
				const d = new Date(a.date + "T00:00:00");
				if (d >= from && d <= to) {
					slots.push({
						availabilityId: a.id,
						date: a.date,
						startTime: a.startTime,
						endTime: a.endTime,
						timezone: a.timezone || null,
					});
				}
			}
		}
	}

	slots.sort((x, y) => {
		if (x.date !== y.date) return x.date < y.date ? -1 : 1;
		return parseTimeToMinutes(x.startTime) - parseTimeToMinutes(y.startTime);
	});

	return slots;
};

/**
 * Create availability (recurring or one-off)
 * Requires auth middleware that sets req.user = { id, role, ... }
 */
const createAvailability = async (req, res) => {
	try {
		// optional extra guard: ensure user is a mentor
		if (!req.user || !req.user.role || req.user.role.name !== "mentor") {
			return res
				.status(403)
				.json({ message: "Only mentors can create availability" });
		}

		const userId = req.user.id;
		const {
			recurrenceType = "one-off", // "one-off" | "weekly" | "daily"
			dayOfWeek,
			date,
			startTime,
			endTime,
			startDate,
			endDate,
			timezone,
		} = req.body;

		// validation
		if (!["one-off", "weekly", "daily"].includes(recurrenceType)) {
			return res.status(400).json({ message: "Invalid recurrenceType" });
		}

		if (!startTime || !endTime) {
			return res
				.status(400)
				.json({ message: "startTime and endTime are required" });
		}

		const startMinutes = parseTimeToMinutes(startTime);
		const endMinutes = parseTimeToMinutes(endTime);
		if (startMinutes === null || endMinutes === null) {
			return res
				.status(400)
				.json({ message: "Invalid time format (expected HH:mm or HH:mm:ss)" });
		}
		if (startMinutes >= endMinutes) {
			return res
				.status(400)
				.json({ message: "startTime must be before endTime" });
		}

		if (
			recurrenceType === "weekly" &&
			(dayOfWeek === undefined || dayOfWeek === null)
		) {
			return res.status(400).json({
				message: "dayOfWeek is required for weekly availability (0-6)",
			});
		}

		if (recurrenceType === "one-off" && !date) {
			return res.status(400).json({
				message: "date is required for one-off availability (YYYY-MM-DD)",
			});
		}

		// create
		const av = await MentorAvailability.create({
			userId,
			recurrenceType,
			dayOfWeek: recurrenceType === "weekly" ? dayOfWeek : null,
			date: recurrenceType === "one-off" ? date : null,
			startTime,
			endTime,
			startDate: recurrenceType !== "one-off" ? startDate || null : null,
			endDate: recurrenceType !== "one-off" ? endDate || null : null,
			timezone: timezone || null,
			isActive: true,
		});

		return res.status(201).json(av);
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};

/**
 * Update availability (mentor must own the availability)
 */
const updateAvailability = async (req, res) => {
	try {
		if (!req.user || !req.user.role || req.user.role.name !== "mentor") {
			return res
				.status(403)
				.json({ message: "Only mentors can update availability" });
		}

		const userId = req.user.id;
		const id = req.params.id;
		const av = await MentorAvailability.findByPk(id);
		if (!av) return res.status(404).json({ message: "Availability not found" });
		if (av.userId !== userId)
			return res.status(403).json({ message: "Forbidden" });

		// Only allow specific fields to be updated
		const updatable = [
			"recurrenceType",
			"dayOfWeek",
			"date",
			"startTime",
			"endTime",
			"startDate",
			"endDate",
			"timezone",
			"isActive",
		];
		const payload = {};
		for (const key of updatable) {
			if (req.body[key] !== undefined) payload[key] = req.body[key];
		}

		// basic validation if times present
		if (payload.startTime || payload.endTime) {
			const start = payload.startTime || av.startTime;
			const end = payload.endTime || av.endTime;
			const sMin = parseTimeToMinutes(start);
			const eMin = parseTimeToMinutes(end);
			if (sMin === null || eMin === null)
				return res.status(400).json({
					message: "Invalid time format (expected HH:mm or HH:mm:ss)",
				});
			if (sMin >= eMin)
				return res
					.status(400)
					.json({ message: "startTime must be before endTime" });
		}

		await av.update(payload);
		return res.json(av);
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};

/**
 * Soft-delete availability (mentor must own it)
 */
const deleteAvailability = async (req, res) => {
	try {
		if (!req.user || !req.user.role || req.user.role.name !== "mentor") {
			return res
				.status(403)
				.json({ message: "Only mentors can delete availability" });
		}

		const userId = req.user.id;
		const id = req.params.id;
		const av = await MentorAvailability.findByPk(id);
		if (!av) return res.status(404).json({ message: "Availability not found" });
		if (av.userId !== userId)
			return res.status(403).json({ message: "Forbidden" });

		av.isActive = false;
		await av.save();
		return res.json({ message: "Availability deleted" });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};

/**
 * Get expanded availability slots for a mentor between from..to
 * Public endpoint (or can be protected) - expects query params: ?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
const getMentorAvailability = async (req, res) => {
	try {
		const mentorId = req.params.id;
		const { from, to } = req.query;
		if (!from || !to)
			return res.status(400).json({
				message: "Provide 'from' and 'to' query params in YYYY-MM-DD format",
			});

		const availabilities = await MentorAvailability.findAll({
			where: { userId: mentorId, isActive: true },
		});

		const slots = expandAvailabilitiesToSlots(availabilities, from, to);

		// Group by date
		const grouped = slots.reduce((acc, slot) => {
			const { date, ...rest } = slot;
			if (!acc[date]) acc[date] = [];
			acc[date].push(rest);
			return acc;
		}, {});

		return res.json({ slotsByDate: grouped });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};

module.exports = {
	createAvailability,
	updateAvailability,
	deleteAvailability,
	getMentorAvailability,
	expandAvailabilitiesToSlots,
};
