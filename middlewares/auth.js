const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

const authenticate = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ message: "Missing or invalid Authorization header" });
	}

	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		// attach user info to request
		const user = await User.findByPk(payload.id, {
			include: { model: Role, as: "role" },
		});
		if (!user) return res.status(401).json({ message: "User not found" });
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

const authorizeRole = (requiredRole) => {
	return (req, res, next) => {
		if (!req.user || req.user.role.name !== requiredRole) {
			return res
				.status(403)
				.json({ message: "Forbidden: insufficient permissions" });
		}
		next();
	};
};

module.exports = { authenticate, authorizeRole };
