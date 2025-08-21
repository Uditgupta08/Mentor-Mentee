// routes/dashboard.js
const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboardController");
const { authenticate, authorizeRole } = require("../middlewares/auth");

// GET /api/dashboard
router.get("/", authenticate, getDashboard);

module.exports = router;
