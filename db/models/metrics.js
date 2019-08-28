/**
 * Define the metrics table
 */

/**
 * sequelize is required to proved datatypes
 */

const Sequelize = require('sequelize');

/**
 * Metrics is a list of columns in the metrics table
 */

const Metrics = {
  name: {
    type: Sequelize.STRING,
  },
};

/**
 * Metrics is exported to ./index
 */

module.exports = Metrics;
