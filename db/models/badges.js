/**
 * Definition for badge table
 */

/**
 * sequelize required to define datatypes
 */

const Sequelize = require('sequelize');

/**
 * Badges is a list of Badges columns
 */

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

/**
 * Badges is exported to ./index
 */

module.exports = Badges;
