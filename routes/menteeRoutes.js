const express = require("express");
const { authenticate, authorizeRole } = require("../middlewares/auth");
const {
	registerMentee,
	loginMentee,
	logoutMentee,
	getProfile,
} = require("../controllers/menteeController");
const { route } = require("./user");

const router = express.Router();

// Mentee routes
router.post("/register", registerMentee);
router.post("/login", loginMentee);
router.post("/logout", authenticate, authorizeRole("mentee"), logoutMentee);
router.get("/me", authenticate, authorizeRole("mentee"), getProfile);

module.exports = router;
