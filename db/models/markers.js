const Sequelize = require('sequelize');

const Markers = {
  lat: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  long: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

module.exports = Markers;
