// db/userQueries.js
const { sequelize } = require("../config/db");
const { QueryTypes } = require("sequelize");

/**
 * Insert a new user and return the created row.
 */
async function createUser({ fullname, username, email, password }) {
	const sql = `
    INSERT INTO "Users"
      (fullname, username, email, password, "createdAt", "updatedAt")
    VALUES
      (:fullname, :username, :email, :password, NOW(), NOW())
    RETURNING *;
  `;
	const [rows] = await sequelize.query(sql, {
		replacements: { fullname, username, email, password },
		type: QueryTypes.INSERT,
	});
	// rows is an array of created rows; return the first
	return rows[0];
}

/**
 * Find one user by username OR email.
 */
async function findByUsernameOrEmail(username, email) {
	const sql = `
    SELECT *
    FROM "Users"
    WHERE username = :username OR email = :email
    LIMIT 1;
  `;
	const users = await sequelize.query(sql, {
		replacements: { username, email },
		type: QueryTypes.SELECT,
	});
	return users[0] || null;
}

/**
 * Find a user by its primary key.
 */
async function findById(id) {
	const sql = `
    SELECT *
    FROM "Users"
    WHERE id = :id
    LIMIT 1;
  `;
	const users = await sequelize.query(sql, {
		replacements: { id },
		type: QueryTypes.SELECT,
	});
	return users[0] || null;
}

/**
 * Find a user by username.
 */
async function findByUsername(username) {
	const sql = `
    SELECT *
    FROM "Users"
    WHERE username = :username
    LIMIT 1;
  `;
	const users = await sequelize.query(sql, {
		replacements: { username },
		type: QueryTypes.SELECT,
	});
	return users[0] || null;
}

/**
 * Update only the password field for a given user ID.
 */
async function updatePassword(id, newHashedPassword) {
	const sql = `
    UPDATE "Users"
    SET password = :password, "updatedAt" = NOW()
    WHERE id = :id;
  `;
	const [result] = await sequelize.query(sql, {
		replacements: { id, password: newHashedPassword },
		type: QueryTypes.UPDATE,
	});
	return result; // number of affected rows
}

/**
 * Delete a user by ID.
 */
async function deleteUser(id) {
	const sql = `
    DELETE FROM "Users"
    WHERE id = :id;
  `;
	const result = await sequelize.query(sql, {
		replacements: { id },
		type: QueryTypes.DELETE,
	});
	return result; // number of affected rows
}

module.exports = {
	createUser,
	findByUsernameOrEmail,
	findById,
	findByUsername,
	updatePassword,
	deleteUser,
};
