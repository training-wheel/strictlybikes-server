const Sequelize = require('sequelize');
const definitions = require('../db/models/index');
const connection = new Sequelize('strictlybikes', 'makmillie', 'password', {
  host: 'localhost',
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
  //drop tables before creating again
  connection.drop();
  for(const name in definitions) {
    models[name] = connection.define(name, definitions[name]);
    connection.sync();
  }

module.exports.connection = connection;
module.exports.models = models;