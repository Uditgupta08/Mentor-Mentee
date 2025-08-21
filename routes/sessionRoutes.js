const express = require("express");
const { authenticate, authorizeRole } = require("../middlewares/auth");
const { listMySessions } = require("../controllers/sessionController");

const router = express.Router();

router.get("/", authenticate, listMySessions);

module.exports = router;
