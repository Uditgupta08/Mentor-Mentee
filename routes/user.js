// const express = require("express");
// const { registerUser, loginUser, logoutUser } = require("../controllers/user");
// const { verifyToken } = require("../middlewares/auth");
// const userRouter = express.Router();

// userRouter.get("/registerUser", (req, res) => {
// 	res.render("user/register", { error: null });
// });

// userRouter.post("/registerUser", registerUser);

// userRouter.get("/loginUser", (req, res) => {
// 	res.render("user/login", { error: null });
// });

// userRouter.get("/success", verifyToken, (req, res) => {
// 	res.render("user/success", { user: req.user });
// });

// userRouter.post("/loginUser", loginUser);

// userRouter.get("/logout", logoutUser);

// module.exports = userRouter;
