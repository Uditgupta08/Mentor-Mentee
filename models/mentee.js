const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const MenteeProfile = sequelize.define(
	"MenteeProfile",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		goals: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		interests: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
		},
		// The userId foreign key is automatically added by the
		// association in models/index.js
	},
	{ timestamps: true }
);

module.exports = MenteeProfile;
