const express = require("express");
const router = express.Router();
const {
	createAvailability,
	updateAvailability,
	deleteAvailability,
	getMentorAvailability,
} = require("../controllers/availabilityController");
const { authenticate, authorizeRole } = require("../middlewares/auth");

// mentor sets availability (must be mentor)
router.post("/", authenticate, authorizeRole("mentor"), createAvailability);

// update a slot (mentor)
router.put("/:id", authenticate, authorizeRole("mentor"), updateAvailability);

// delete (soft) a slot (mentor)
router.delete(
	"/:id",
	authenticate,
	authorizeRole("mentor"),
	deleteAvailability
);

// public: get mentor's expanded slots for a date range
router.get("/mentor/:id", getMentorAvailability);

module.exports = router;
