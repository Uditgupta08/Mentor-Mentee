const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const passport = require("passport");

const expressConfig = (app) => {
	app.use(bodyParser.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors());
	app.use(cookieParser());
	app.use(methodOverride("_method"));
	app.use(express.static(path.join(__dirname, "../public")));
	app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

	app.set("view engine", "ejs");

	app.use(
		session({
			secret: process.env.SESSION_SECRET || "default_secret",
			resave: false,
			saveUninitialized: false,
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());
};

module.exports = expressConfig;
