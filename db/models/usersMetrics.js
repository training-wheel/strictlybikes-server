const Sequelize = require('sequelize');
const db = require('../index');
const UserMetrics = {
  value: {
    type: Sequelize.INTEGER,
    allowNull : false
  },
};

module.exports = UserMetrics;