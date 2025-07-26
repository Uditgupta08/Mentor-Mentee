const { User, MentorProfile, Role } = require("../models");
const jwt = require("jsonwebtoken");

const registerMentor = async (req, res) => {
	const {
		firstname,
		lastname,
		username,
		email,
		password,
		expertise,
		yearsOfExperience,
	} = req.body;
	try {
		const role = await Role.findOne({ where: { name: "mentor" } });
		if (!role)
			return res.status(500).json({ message: "Mentor role not configured" });

		const user = await User.create({
			firstname,
			lastname,
			username,
			email,
			password,
			roleId: role.id,
		});
		await MentorProfile.create({
			userId: user.id,
			expertise,
			yearsOfExperience,
		});

		return res.status(201).json({ message: "Mentor registered successfully" });
	} catch (err) {
		console.error(err);
		return res.status(400).json({ message: err.message });
	}
};

const loginMentor = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({
			where: { email },
			include: { model: Role, as: "role" },
		});
		if (!user || user.role.name !== "mentor") {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch)
			return res.status(401).json({ message: "Invalid credentials" });

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});
		res.cookie("token", token, { httpOnly: true });
		return res.json({ token });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

const logoutMentor = (req, res) => {
	res.clearCookie("token");
	return res.json({ message: "Logged out successfully" });
};

const getProfileMentor = async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id, {
			include: [
				{ model: Role, as: "role" },
				{ model: MentorProfile, as: "mentorProfile" },
			],
		});
		return res.json(user);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

module.exports = {
	registerMentor,
	loginMentor,
	logoutMentor,
	getProfileMentor,
};
