// models/MentorAvailability.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const MentorAvailability = sequelize.define(
	"MentorAvailability",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},

		// foreign key to User (mentor). You can also add this via associations,
		// but keeping it here makes migrations straightforward.
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},

		recurrenceType: {
			type: DataTypes.ENUM("one-off", "weekly", "daily"),
			allowNull: false,
			defaultValue: "one-off",
		},

		// used if recurrenceType === "weekly"
		dayOfWeek: {
			type: DataTypes.INTEGER, // 0 (Sun) - 6 (Sat)
			allowNull: true,
		},

		// for one-off availability
		date: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},

		// times are stored as TIME strings ("15:00:00" or "15:00")
		startTime: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		endTime: {
			type: DataTypes.TIME,
			allowNull: false,
		},

		// optional window for recurring rule
		startDate: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		endDate: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},

		// optional timezone label (default null => server timezone)
		timezone: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{ timestamps: true }
);

module.exports = MentorAvailability;
