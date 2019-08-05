const Sequelize = require('sequelize');
const db = require('../index');
const Conditions = {
  name: {
    type: Sequelize.STRING,
    allowNull : false
  },
  routeType: {
    type: Sequelize.ENUM('fastest', 'shortest', 'thrilling'),
    allowNull : false
  },
  avoid: {
    type: Sequelize.ENUM('unpavedRoads', 'alreadyUsedRoads', 'ferries', 'motorways', 'tollRoads'),
    allowNull : false
  },
  hilliness: {
    type: Sequelize.ENUM('low', 'normal', 'high'),
    allowNull : false
  },
  windingness: {
    type: Sequelize.ENUM('low', 'normal', 'high'),
    allowNull : false
  }
};

module.exports = Conditions;