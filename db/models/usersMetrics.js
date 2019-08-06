const Sequelize = require('sequelize');
const db = require('../index');
const UserMetrics = {
  value: {
    type: Sequelize.INTEGER,
    allowNull : false,
    defaultValue: 0
  },
};

module.exports = UserMetrics;