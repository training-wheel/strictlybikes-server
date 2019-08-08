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
  code: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  state: {
    type: Sequelize.ENUM('init', 'playing', 'end'),
    allowNull: false,
    defaultValue: 'init',
  },
};

module.exports = Games;
