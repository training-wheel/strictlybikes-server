const Sequelize = require('sequelize');
const db = require('../index');
const Badges = {
  name: {
    type: Sequelize.STRING,
    allowNull : false
  },
  image: {
    type: Sequelize.STRING,
    allowNull : false
  },
};

module.exports = Badges;