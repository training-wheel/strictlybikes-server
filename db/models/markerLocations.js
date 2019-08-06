const Sequelize = require('sequelize');
const db = require('../index');
const MarkerLocations = {
  markerId: {
    type: Sequelize.INTEGER,
    allowNull : false
  },
  longitude: {
    type: Sequelize.INTEGER,
    allowNull : false
  },
  latitude: {
    type: Sequelize.INTEGER,
    allowNull : false
  }
};

module.exports = MarkerLocations;