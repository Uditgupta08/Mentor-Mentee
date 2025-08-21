const express = require("express");
const { authenticate, authorizeRole } = require("../middlewares/auth");
const {
	sendRequest,
	respondRequest,
} = require("../controllers/mentorshipRequestController");

const router = express.Router();

router.post("/", authenticate, sendRequest);
router.patch(
	"/:id/respond",
	authenticate,
	authorizeRole("mentor"),
	respondRequest
);

module.exports = router;
