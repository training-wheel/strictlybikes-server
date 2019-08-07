const Sequelize = require('sequelize');
const db = require('../index');
const MarkerLocations = {
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