/**
 * Define the usersmetrics table
 */

/**
 * sequelize is required to provide datatypes
 */

const Sequelize = require('sequelize');

/**
 * UsersMetrics is a list of all columns in usersmetrics
 */

const UsersMetrics = {
  value: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
};

/**
 * UsersMetrics is exported to ./index
 */

module.exports = UsersMetrics;
