// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   fullname: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: function () {
//       return !this.googleId;
//     },
//   },
// });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password") || !this.password) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// userSchema.methods.comparePassword = async function (candidatePass) {
//   if (!this.password) return false;
//   return await bcrypt.compare(candidatePass, this.password);
// };

// const User = mongoose.models.User || mongoose.model("User", userSchema);
// module.exports = User;

// models/User.js
const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");

const User = sequelize.define("User", {
	fullname: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	username: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
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
});

// Hash password before saving
User.beforeCreate(async (user) => {
	if (user.password) {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
	}
});

// Method to compare password
User.prototype.comparePassword = async function (candidatePass) {
	if (!this.password) return false;
	return await bcrypt.compare(candidatePass, this.password);
};

module.exports = User;
