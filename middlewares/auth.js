const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
	const token = req.cookies.accessToken;
	console.log("Verifying token for request...");
	if (!token) {
		console.log("Token not found");
		req.isAuthenticated = false;
		req.user = null;
		return next();
	}
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.user = { id: decoded.id, fullname: decoded.fullname };
		req.isAuthenticated = true;
		console.log("Token verified. User:", req.user);
		next();
	} catch (err) {
		console.log("Error verifying token:", err);
		req.isAuthenticated = false;
		req.user = null;
		next();
	}
};

module.exports = { verifyToken };
