const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Role = sequelize.define(
	"Role",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{ timestamps: false }
);

module.exports = Role;
