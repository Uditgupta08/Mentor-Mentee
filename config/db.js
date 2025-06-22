// const mongoose = require("mongoose");
// const connectDB = async () => {
//   try {
//     const connect = await mongoose.connect(process.env.CONNECTION_STRING);
//     console.log(
//       "DATABASE CONNECTED : ",
//       connect.connection.host,
//       connect.connection.name
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };
// module.exports = connectDB;

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
	dialect: "postgres",
	logging: false,
});
const connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log("DATABASE CONNECTED");
	} catch (err) {
		console.error("Unable to connect to DB:", err);
	}
};

module.exports = { sequelize, connectDB };
