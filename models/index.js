const { sequelize } = require("../config/db");
const Sequelize = require("sequelize");

// 1. Import all models
const User = require("./user");
const Role = require("./role");
const MentorProfile = require("./mentor");
const MentorAvailability = require("./mentorAvailability");
const MenteeProfile = require("./mentee");
const MentorshipRequest = require("./mentorShipRequests");
const Session = require("./sessions");

// 2. Create the associations

// User <-> Role
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { as: "role", foreignKey: "roleId" }); // Added alias for consistency

// User <-> MentorProfile
User.hasOne(MentorProfile, {
	as: "mentorProfile", // FIXED: Added alias to match controller include
	foreignKey: { name: "userId", allowNull: false },
	onDelete: "CASCADE",
});
MentorProfile.belongsTo(User, { foreignKey: "userId" });

// MentorProfile <-> MentorAvailability
User.hasMany(MentorAvailability, {
	as: "availabilities",
	foreignKey: "userId",
});
MentorAvailability.belongsTo(User, { as: "mentor", foreignKey: "userId" });

// User <-> MenteeProfile
User.hasOne(MenteeProfile, {
	as: "menteeProfile", // FIXED: Added alias to match controller include
	foreignKey: { name: "userId", allowNull: false },
	onDelete: "CASCADE",
});
MenteeProfile.belongsTo(User, { foreignKey: "userId" });

// Mentorship Request associations
MentorshipRequest.belongsTo(User, { as: "Mentee", foreignKey: "menteeId" });
MentorshipRequest.belongsTo(User, { as: "Mentor", foreignKey: "mentorId" });
User.hasMany(MentorshipRequest, { as: "SentRequests", foreignKey: "menteeId" });
User.hasMany(MentorshipRequest, {
	as: "ReceivedRequests",
	foreignKey: "mentorId",
});

// Session associations
Session.belongsTo(User, { as: "Mentee", foreignKey: "menteeId" });
Session.belongsTo(User, { as: "Mentor", foreignKey: "mentorId" });
User.hasMany(Session, { as: "MentorSessions", foreignKey: "mentorId" });
User.hasMany(Session, { as: "MenteeSessions", foreignKey: "menteeId" });

// 3. Export all the models and the sequelize connection
const db = {
	sequelize,
	Sequelize,
	User,
	Role,
	MentorProfile,
	MenteeProfile,
	MentorshipRequest,
	MentorAvailability,
	Session,
};

module.exports = db;

