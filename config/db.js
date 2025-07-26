const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
	dialect: "postgres",
	logging: false,
	define: {
		freezeTableName: true,
	},
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
