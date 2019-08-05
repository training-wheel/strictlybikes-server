const Sequelize = require('sequelize');
const db = require('../index');
const Users = {
  name: {
    type: Sequelize.STRING,
    allowNull : false
  },
  email: {
    type: Sequelize.STRING,
    allowNull : false
  },
  totalDistance: {
    type: Sequelize.INTEGER,
    allowNull : true
  },
};

module.exports = Users;