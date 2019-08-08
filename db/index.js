/* eslint-disable no-console */
const Sequelize = require('sequelize');
const definitions = require('../db/models/index');

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_USER_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
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
