/**
 * Define the markers table
 */

/**
 * sequelize required to provide datatypes
 */

const Sequelize = require('sequelize');

/**
 * Markers is a list of columns in the markers table
 */

const Markers = {
  lat: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  long: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

/**
 * Markers is exported to ./index
 */

module.exports = Markers;
