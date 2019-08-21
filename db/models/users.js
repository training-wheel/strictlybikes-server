const Sequelize = require('sequelize');

const Users = {
  googleId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  gamesCreated: {
    type: Sequelize.NUMBER,
    allowNull: true,
    defaultValue: 0,
  },
};

module.exports = Users;
