/**
 * Define the usergames table
 */

/**
 * Sequelize required to provide datatypes
 */

const Sequelize = require('sequelize');

/**
 * UsersGames is a list of columns in usersgames
 */

const UsersGames = {
  markerCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  polyline: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  team: {
    type: Sequelize.ENUM('blue', 'orange'),
    defaultValue: 'blue',
  },
};

/**
 * UsersGames is exported to ./index
 */

module.exports = UsersGames;
