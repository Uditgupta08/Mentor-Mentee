const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Session = sequelize.define(
	"Session",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		scheduledTime: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		comments: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM("SCHEDULED", "COMPLETED", "CANCELLED"),
			defaultValue: "SCHEDULED",
			allowNull: false,
		},
	},
	{ timestamps: true }
);

module.exports = Session;
