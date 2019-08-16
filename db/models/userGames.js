const Sequelize = require('sequelize');

const UsersGames = {
  markerCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  polyline: {
    type: Sequelize.STRING,
    allowNull: true,
  },
};

module.exports = UsersGames;
