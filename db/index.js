/* eslint-disable no-console */
const Sequelize = require('sequelize');
const definitions = require('../db/models/index');

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
for (const name in definitions) {
  models[name] = connection.define(name, definitions[name]);
  connection.sync();
}
const {
  users, games, markers, usermarkers, usergames, badges, userbadges, metrics, usermetrics,
} = models;
users.hasMany(usergames);
games.hasMany(usergames);
games.belongsTo(users);
markers.belongsTo(games);
users.hasMany(usermarkers);
markers.hasMany(usermarkers);
users.hasMany(usermetrics);
metrics.hasMany(usermetrics);
badges.belongsTo(metrics);
users.hasMany(userbadges);
badges.hasMany(userbadges);


module.exports.connection = connection;
module.exports.models = models;
