const { Router } = require('restify-router');
const { models, Sequelize, connection } = require('../../db/index');

const { Op } = Sequelize;
const {
  users, badges, usergames, games, markers,
} = models;

const router = new Router();

const getProfile = async (req, res) => {
  try {
    const { user: userId } = req;
    const { username, imageUrl } = await users.findByPk(userId);
    const [userBadgeIdObjects] = await connection
      .query(`SELECT userbadges."badgeId" FROM userbadges WHERE userbadges."userId" = ${userId}`);
    const userBadgeIds = userBadgeIdObjects.map(userbadge => userbadge.badgeId);
    const userBadges = await badges.findAll({
      where: {
        id: {
          [Op.or]: userBadgeIds,
        },
      },
    });
    const [userMetrics] = await connection.query(`SELECT usermetrics.value, metrics.name FROM usermetrics, metrics
      WHERE usermetrics."userId" = ${userId} AND metrics.id = usermetrics."metricId"`);
    const allGames = await usergames.findAll({
      where: {
        userId,
      },
    });
    const gameIds = allGames.map(game => game.gameId);
    const gameInfo = await games.findAll({
      where: {
        state: 'end',
        [Op.or]: {
          id: gameIds,
        },
      },
    });
    const gameMarkers = await markers.findAll({
      where: {
        [Op.or]: {
          gameId: gameIds,
        },
      },
    });
    const playersPromise = await gameIds.map(async (gameId) => {
      try {
        const query = `SELECT usergames.*, users.username FROM usergames, users WHERE usergames."gameId" = ${gameId} AND users.id = usergames."userId"`;
        const [players] = await connection.query(query);
        return players;
      } catch (err) {
        console.error('Failed to retrieve players');
        return err;
      }
    });
    const players = await Promise.all(playersPromise);
    players.forEach((playerArray) => {
      const { gameId } = playerArray[0];
      for (let i = 0; i < gameInfo.length; i += 1) {
        if (gameInfo[i].id === gameId) {
          gameInfo[i].players = playerArray;
          return;
        }
      }
    });
    const profile = {
      gameInfo,
      gameMarkers,
      players,
      username,
      imageUrl,
      userBadges,
      userMetrics,
    };
    res.send(200, profile);
  } catch (err) {
    console.error(`Failed to get profile: ${err}`);
    res.send(500, 'Failed to get profile');
  }
};

router.get('/profile', getProfile);

module.exports = router;
