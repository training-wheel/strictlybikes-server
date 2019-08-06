const Sequelize = require('sequelize');
const db = require('../index');
const SavedTrips = {
  userId: {
    type: Sequelize.INTEGER,
    allowNull : false
  },
  startLongitude: {
    type: Sequelize.INTEGER,
    allowNull : false
  },
  startLatitude: {
    type: Sequelize.INTEGER,
    allowNull : false
  },
  endLongitude: {
    type: Sequelize.INTEGER,
    allowNull : false
  },
  endLatitude: {
    type: Sequelize.INTEGER,
    allowNull : false
  },
};

module.exports = SavedTrips;