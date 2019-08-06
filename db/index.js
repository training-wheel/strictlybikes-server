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
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  const models = {};
  for(const name in definitions) {
    models[name] = connection.define(name, definitions[name]);
    connection.sync();
  } 
const {users, badges, markers, userbadges, markerlocations, savedtrips, metrics, usersmetrics, conditions} = models;
badges.belongsTo(metrics)
users.hasMany(userbadges);
badges.hasMany(userbadges);
savedtrips.belongsTo(conditions);
users.belongsTo(savedtrips);
users.hasMany(usersmetrics);
metrics.hasMany(usersmetrics);
markers.belongsTo(markerlocations);

module.exports.connection = connection;
module.exports.models = models;