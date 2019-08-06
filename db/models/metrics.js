const Sequelize = require('sequelize');
const db = require('../index');
const Metrics = {
  name: {
    type: Sequelize.STRING,
    allowNull : false
  },
};

module.exports = Metrics;