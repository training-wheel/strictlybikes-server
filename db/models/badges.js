const Sequelize = require('sequelize');

const Badges = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  goal: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

module.exports = Badges;
