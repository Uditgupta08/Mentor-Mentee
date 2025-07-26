const { sequelize } = require("../config/db");
const { QueryTypes } = require("sequelize");
async function createMentor({
  fullname,
  username,
  email,
  password,
  bio,
  expertise,
  yearsOfExperience,
  availability,
  linkedinUrl
}) {
  const query = `
    INSERT INTO "Mentors"
      (fullname, username, email, password, bio, expertise, "yearsOfExperience", availability, "linkedinUrl", "createdAt", "updatedAt")
    VALUES
      (:fullname, :username, :email, :password, :bio, :expertise, :yearsOfExperience, :availability, :linkedinUrl, NOW(), NOW())
    RETURNING *;
  `;
  const [rows] = await sequelize.query(query, {
    replacements: {
      fullname,
      username,
      email,
      password,
      bio,
      expertise,
      yearsOfExperience,
      availability,
      linkedinUrl
    },
    type: QueryTypes.INSERT
  });
  return rows[0];
}

/**
 * Find one mentor by username OR email.
 */
async function findByUsernameOrEmail(username, email) {
  const query = `
    SELECT *
    FROM "Mentors"
    WHERE username = :username OR email = :email
    LIMIT 1;
  `;
  const mentors = await sequelize.query(query, {
    replacements: { username, email },
    type: QueryTypes.SELECT
  });
  return mentors[0] || null;
}

/**
 * Find a mentor by username.
 */
async function findByUsername(username) {
  const query = `
    SELECT *
    FROM "Mentors"
    WHERE username = :username
    LIMIT 1;
  `;
  const mentors = await sequelize.query(query, {
    replacements: { username },
    type: QueryTypes.SELECT
  });
  return mentors[0] || null;
}

module.exports = {
  createMentor,
  findByUsernameOrEmail,
  findByUsername
};
