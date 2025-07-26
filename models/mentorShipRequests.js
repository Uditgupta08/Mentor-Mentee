const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const MentorshipRequest = sequelize.define(
	"MentorshipRequest",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED"),
			defaultValue: "PENDING",
			allowNull: false,
		},
		// The mentorId and menteeId foreign keys are automatically
		// added by the associations in models/index.js
	},
	{
		timestamps: true,
	}
);

module.exports = MentorshipRequest;
