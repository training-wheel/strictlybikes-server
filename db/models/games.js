const Sequelize = require('sequelize');

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
};

module.exports = Games;
