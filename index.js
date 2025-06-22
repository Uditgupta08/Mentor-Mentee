// const express = require("express");
// const connectDB = require("./config/db");
// const expressConfig = require("./config/expressConfig");
// const { verifyToken } = require("./middlewares/auth");
// const routes = require("./routes/index");
// require("dotenv").config();

// const app = express();

// connectDB();

// expressConfig(app);

// app.use("/", routes);

// app.get("/", verifyToken, (req, res) => {
//   res.render("index", { user: req.user || null });
// });
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
require("dotenv").config();
const { connectDB, sequelize } = require("./config/db");
const expressConfig = require("./config/expressConfig");
const routes = require("./routes/index");
const { verifyToken } = require("./middlewares/auth");

const app = express();

connectDB(); // Sequelize DB connection
sequelize.sync(); // Creates tables if they don't exist

expressConfig(app); // bodyParser, view engine, etc.

app.use("/", routes);

app.get("/", verifyToken, (req, res) => {
	res.render("index", { user: req.user || null });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
