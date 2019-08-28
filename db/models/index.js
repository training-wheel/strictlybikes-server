/**
 * Require and export all table definitions
 */

const Badges = require('./badges');
const Games = require('./games');
const Markers = require('./markers');
const UserBadges = require('./userBadges');
const UserGames = require('./userGames');
const UserMarkers = require('./userMarkers');
const Users = require('./users');
const UserMetrics = require('./userMetrics');
const Metrics = require('./metrics');

module.exports.badges = Badges;
module.exports.games = Games;
module.exports.markers = Markers;
module.exports.userbadges = UserBadges;
module.exports.usergames = UserGames;
module.exports.usermarkers = UserMarkers;
module.exports.users = Users;
module.exports.usermetrics = UserMetrics;
module.exports.metrics = Metrics;
