const { User, MenteeProfile, Role } = require("../models");
const jwt = require("jsonwebtoken");

const registerMentee = async (req, res) => {
	const { firstname, lastname, username, email, password, goals, interests } =
		req.body;
	try {
		const role = await Role.findOne({ where: { name: "mentee" } });
		if (!role)
			return res.status(500).json({ message: "Mentee role not configured" });

		const user = await User.create({
			firstname,
			lastname,
			username,
			email,
			password,
			roleId: role.id,
		});
		await MenteeProfile.create({ userId: user.id, goals, interests });

		return res.status(201).json({ message: "Mentee registered successfully" });
	} catch (err) {
		console.error("🔥 registerMentee error:", err);
		if (err.name === "SequelizeUniqueConstraintError") {
			return res
				.status(409)
				.json({ message: "User with this email or username already exists." });
		}
		if (err.name === "SequelizeDatabaseError") {
			return res.status(400).json({ message: err.message });
		}
		console.error("Error in registerMentee:", err);
		return res
			.status(500)
			.json({ message: "An unexpected error occurred during registration." });
	}
};

// Login mentee
// const loginMentee = async (req, res) => {
// 	const { email, password } = req.body;
// 	try {
// 		const user = await User.findOne({
// 			where: { email },
// 			include: { model: Role, as: "role" },
// 		});
// 		if (!user || user.role.name !== "mentee") {
// 			return res.status(401).json({ message: "Invalid credentials" });
// 		}
// 		const isMatch = await user.comparePassword(password);
// 		if (!isMatch)
// 			return res.status(401).json({ message: "Invalid credentials" });

// 		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
// 			expiresIn: "7d",
// 		});
// 		res.cookie("token", token, { httpOnly: true });
// 		return res.json({ token });
// 	} catch (err) {
// 		console.error(err);
// 		return res.status(500).json({ message: "Server error" });
// 	}
// };

const loginMentee = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({
			where: { email },
			include: { model: Role, as: "role" },
		});

		if (!user) {
			console.error("User not found for email:", email);
			return res.status(401).json({ message: "Invalid credentials" });
		}

		if (!user.comparePassword) {
			console.error("comparePassword method is missing from user");
			console.error("User instance:", user.toJSON());
			return res.status(500).json({ message: "Server error" });
		}

		const isMatch = await user.comparePassword(password);
		// if (!isMatch) {
		// 	console.error("Password mismatch for:", email);
		// 	return res.status(401).json({ message: "Invalid credentials" });
		// }
		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});
		res.cookie("token", token, { httpOnly: true });
		return res.json({ success: true, token });
	} catch (err) {
		console.error("🔥 loginMentee error:", err);
		return res.status(500).json({ message: "Server error" });
	}
};

// Logout mentee
const logoutMentee = (req, res) => {
	res.clearCookie("token");
	return res.json({ message: "Logged out successfully" });
};

// Get mentee profile
const getProfile = async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id, {
			include: [
				{ model: Role, as: "role" },
				{ model: MenteeProfile, as: "menteeProfile" },
			],
		});
		return res.json(user);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

module.exports = {
	registerMentee,
	loginMentee,
	logoutMentee,
	getProfile,
};
