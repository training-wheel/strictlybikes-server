const Sequelize = require('sequelize');
const db = require('../index');
const UsersGames = {
  markerCount: {
    type: Sequelize.INTEGER,
<<<<<<< HEAD:db/models/usersMetrics.js
    allowNull : false,
    defaultValue: 0
  },
=======
    defaultValue: 0
  }
>>>>>>> redid the models for game:db/models/userGames.js
};

module.exports = UsersGames;