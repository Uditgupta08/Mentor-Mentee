const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const MentorProfile = sequelize.define(
	"MentorProfile",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		expertise: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
		},
		yearsOfExperience: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		rating: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
		},
		// The userId foreign key is automatically added by the
		// association in models/index.js
	},
	{ timestamps: true }
);

module.exports = MentorProfile;
