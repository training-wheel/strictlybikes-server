const Sequelize = require('sequelize');

const Users = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gamesCreated: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: 0,
  },
};

module.exports = Users;
