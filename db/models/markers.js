const Sequelize = require('sequelize');
const db = require('../index');
const Markers = {
  lat: {
    type: Sequelize.STRING,
    allowNull : false
  },
  long: {
    type: Sequelize.STRING,
    allowNull: false
  },
};

module.exports = Markers;