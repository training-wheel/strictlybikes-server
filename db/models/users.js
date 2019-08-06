const Sequelize = require('sequelize');
const db = require('../index');
const Users = {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true
  },
  totalDistance: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
};

module.exports = Users;
