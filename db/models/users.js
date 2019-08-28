/**
 * Define the users table
 */

/**
 * sequelize is required to provide datatypes
 */

const Sequelize = require('sequelize');

/**
 * Users is a list of all columns in the users table
 */

const Users = {
  googleId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

/**
 * Users is exported to ./index
 */

module.exports = Users;
