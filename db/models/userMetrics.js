const Sequelize = require('sequelize');

const UsersMetrics = {
  value: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
};

module.exports = UsersMetrics;
