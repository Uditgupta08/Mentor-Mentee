const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		bio: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		availability: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		linkedinUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		// The roleId foreign key is automatically added by the
		// association in models/index.js
	},
	{ timestamps: true }
);

// Hash password hooks
User.beforeCreate(async (user) => {
	if (user.password) {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
	}
});
User.beforeUpdate(async (user) => {
	if (user.changed("password")) {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
	}
});

// Instance method
User.prototype.comparePassword = function (candidate) {
	if (!this.password) return false;
	return bcrypt.compare(candidate, this.password);
};

module.exports = User;
