const express = require("express");
const { authenticate, authorizeRole } = require("../middlewares/auth");
const {
	registerMentor,
	loginMentor,
	logoutMentor,
	getProfileMentor,
} = require("../controllers/mentorController");
const { route } = require("./user");

const router = express.Router();

// Mentee routes
router.post("/register", registerMentor);
router.post("/login", loginMentor);
router.post("/logout", authenticate, authorizeRole("mentee"), logoutMentor);
router.get("/me", authenticate, authorizeRole("mentee"), getProfileMentor);

module.exports = router;
