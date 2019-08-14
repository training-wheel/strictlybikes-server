/* eslint-disable no-console */
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const definitions = require('../db/models/index');
const list = require('./badgeList');
const userMet = require('./userMetrics');

const { DB_NAME, DB_USER, DB_USER_PASSWORD } = process.env;

const connection = new Sequelize(DB_NAME, DB_USER, DB_USER_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
});

connection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
const models = {};
const names = Object.keys(definitions);
names.forEach((name) => {
  models[name] = connection.define(name, definitions[name]);
  connection.sync();
});
// for (const name in definitions) {
//   models[name] = connection.define(name, definitions[name]);
//   connection.sync();
// }
const {
  users, games, markers, usermarkers, usergames, badges, userbadges, metrics, usermetrics,
} = models;
users.hasMany(usergames);
games.hasMany(usergames);
games.belongsTo(users);
markers.belongsTo(games);
users.hasMany(usermarkers);
markers.hasMany(usermarkers);
games.hasMany(usermarkers);
users.hasMany(usermetrics);
metrics.hasMany(usermetrics);
badges.belongsTo(metrics);
users.hasMany(userbadges);
badges.hasMany(userbadges);

// Only need to run once to populate database with badges.

userMet.forEach((metric) => {
  metrics.findCreateFind({ where: metric });
});
list.forEach((badge) => {
  badges.findCreateFind({ where: badge });
});


games.updateMetrics = async (game) => {
  try {
    const allMetrics = await metrics.findAll({
      where: {
        name: {
          [Op.or]: ['Wins', 'Games'],
        },
      },
    });
    const metricsId = allMetrics.reduce((acc, metric) => {
      acc[metric.name] = metric.id;
      return acc;
    }, {});
    const playerGames = await usergames.findAll({ where: { gameId: game.id } });
    playerGames.forEach(async (player) => {
      try {
        const [playedGames] = await usermetrics.findCreateFind({
          where: {
            userId: player.userId,
            metricId: metricsId.Games,
          },
        });
        await playedGames.increment('value');
        const gameBadge = await badges.findOne({
          where: {
            metricId: metricsId.Games,
            goal: playedGames.value,
          },
        });
        if (gameBadge) {
          userbadges.create({
            userId: player.userId,
            badgeId: gameBadge.id,
          });
        }
        if (player.markerCount === game.markerLimit) {
          const wonGames = await usermetrics.findCreateFind({
            where: {
              userId: player.userId,
              metricId: metricsId.Wins,
            },
          });
          await wonGames.increment();
          const wonBadge = await badges.findOne({
            where: {
              metricId: metricsId.Wins,
              goal: wonGames.value,
            },
          });
          if (wonBadge) {
            userbadges.create({
              where: {
                userId: player.userId,
                badgeId: wonBadge.id,
              },
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
};


module.exports.connection = connection;
module.exports.models = models;
module.exports.Sequelize = Sequelize;
