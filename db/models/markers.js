const Sequelize = require('sequelize');
const db = require('../index');
const Markers = {
  name: {
    type: Sequelize.STRING,
    allowNull : false
  },
};

module.exports = Markers;