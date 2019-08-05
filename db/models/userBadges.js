const Sequelize = require('sequelize');
const db = require('../index');
const UserBadges = {
  userId: {
    type: Sequelize.INTEGER,
    allowNull : false
  },
  badgeId: {
    type: Sequelize.INTEGER,
    allowNull : false
  },
};

module.exports = UserBadges;