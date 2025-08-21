const express = require("express");
const mentorRouter = require("./mentorRoutes");
const menteeRouter = require("./menteeRoutes");
const roleRoutes = require("./roleRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const mentorshipRequestRoutes = require("./mentorshipRequestRoutes");
const mentorAvailability = require("./mentorAvailabilityRoutes");

const router = express.Router();

router.use("/roles", roleRoutes);
router.use("/mentor", mentorRouter);
router.use("/mentee", menteeRouter);
router.use("/dashboard", dashboardRoutes);
router.use("/request", mentorshipRequestRoutes);
router.use("/availability", mentorAvailability);

module.exports = router;
