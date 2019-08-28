/**
 * Define the games table
 */

/**
 * sequelize required to provide datatypes
 */

const Sequelize = require('sequelize');

/**
 * Games is a list of columns in the games table
 */

const Games = {
  lat: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  long: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  startTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  markerLimit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  timeLimit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  playerLimit: {
    type: Sequelize.INTEGER,
    defaultValue: 2,
  },
  playerCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  code: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  radius: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  state: {
    type: Sequelize.ENUM('init', 'playing', 'end'),
    allowNull: false,
    defaultValue: 'init',
  },
  mode: {
    type: Sequelize.ENUM('alleycat', 'timeattack', 'teamsprint'),
    allowNull: false,
  },
};

/**
 * Games is exported to ./index
 */

module.exports = Games;
