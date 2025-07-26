const express = require("express");
const mentorRouter = require("./mentorRoutes");
const menteeRouter = require("./menteeRoutes");
const roleRoutes = require("./roleRoutes");

const router = express.Router();
router.use("/roles", roleRoutes);
router.use("/mentor", mentorRouter);
router.use("/mentee", menteeRouter);

module.exports = router;