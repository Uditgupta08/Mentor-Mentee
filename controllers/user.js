// const User = require("../models/user");
// const jwt = require("jsonwebtoken");

// const registerUser = async (req, res) => {
//   const { fullname, username, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).render("user/register", { error: "Email or username already in use!" });
//     }

//     const newUser = new User({ fullname, username, email, password });
//     console.log("Saving new user:", newUser);
//     await newUser.save();
//     const accessToken = jwt.sign(
//       { _id: newUser._id, fullname: newUser.fullname },
//       process.env.SECRET_KEY,
//       { expiresIn: "1d" }
//     );
//     res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax" });
//     res.redirect("/success");
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).render("user/register", { error: "Something went wrong. Please try again!" });
//   }
// };

// const loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).render("user/login", { error: "User not found!" });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).render("user/login", { error: "Invalid credentials!" });
//     }

//     const accessToken = jwt.sign({ _id: user._id, fullname: user.fullname}, process.env.SECRET_KEY, { expiresIn: "1d" });
//     res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax" });

//     res.redirect("/success");
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).render("user/login", { error: "Server error. Please try again!" });
//   }
// };

// const logoutUser = (req, res) => {
//   res.clearCookie("accessToken");
//   res.redirect("/loginUser");
// };

// module.exports = { registerUser, loginUser, logoutUser };

const { Op } = require("sequelize");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
	const { fullname, username, email, password } = req.body;

	try {
		const existingUser = await User.findOne({
			where: {
				[Op.or]: [{ email }, { username }],
			},
		});

		if (existingUser) {
			return res.status(400).render("user/register", {
				error: "Email or username already in use!",
			});
		}

		const newUser = await User.create({ fullname, username, email, password });
		const accessToken = jwt.sign(
			{ id: newUser.id, fullname: newUser.fullname },
			process.env.SECRET_KEY,
			{ expiresIn: "1d" }
		);

		res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax" });
		res.redirect("/success");
	} catch (error) {
		console.error("Registration Error:", error);
		res.status(500).render("user/register", {
			error: "Something went wrong. Please try again!",
		});
	}
};

const loginUser = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ where: { username } });

		if (!user) {
			return res.status(400).render("user/login", { error: "User not found!" });
		}

		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res
				.status(400)
				.render("user/login", { error: "Invalid credentials!" });
		}

		const accessToken = jwt.sign(
			{ id: user.id, fullname: user.fullname },
			process.env.SECRET_KEY,
			{ expiresIn: "1d" }
		);
		res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax" });

		res.redirect("/success");
	} catch (error) {
		console.error("Login Error:", error);
		res
			.status(500)
			.render("user/login", { error: "Server error. Please try again!" });
	}
};

const logoutUser = (req, res) => {
	res.clearCookie("accessToken");
	res.redirect("/loginUser");
};

module.exports = { registerUser, loginUser, logoutUser };
