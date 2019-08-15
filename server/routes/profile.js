const { Router } = require('restify-router');
const { models, Sequelize, connection } = require('../../db/index');

const { Op } = Sequelize;
const {
  users, userbadges, badges, usermetrics, metrics, usergames, games, markers,
} = models;

const router = new Router();

const getProfile = async (req, res) => {
  try {
    const { user: userId } = req;
    const { username, imageUrl } = await users.findByPk(userId);
    const [userBadgeIdObjects] = await connection
      .query('SELECT userbadges."badgeId" FROM userbadges WHERE userbadges."userId" = 1');
    const userBadgeIds = userBadgeIdObjects.map(userbadge => userbadge.badgeId);
    const userBadges = await badges.findAll({
      where: {
        [Op.or]: userBadgeIds,
      },
    });
    const [userMetrics] = await connection.query(`SELECT usermetrics.value, metrics.name FROM usermetrics, metrics
      WHERE usermetrics."userId" = ${userId} AND metrics.id = usermetrics."metricId"`);


    const allGames = await usergames.findAll({
      where: {
        userId,
      },
    });
    const gameIds = allGames.map((game) => {
      return game.id;
    });

    const gameInfo = await games.findAll({
      where: {
        [Op.or]: {
          id: gameIds,
        },
      },
    });

    const gameMarkers = await markers.findAll({
      where: {
        [Op.or]: gameIds,
      },
    });


    const profile = {
      gameInfo,
      gameMarkers,
      username,
      imageUrl,
      userBadges,
      userMetrics,
    };
    
    res.send(200, profile);
    console.log(profile);
  } catch (err) {
    console.error(`Failed to get profile: ${err}`);
    res.send(500, 'Failed to get profile');
  }
};

router.get('/profile', getProfile);

module.exports = router;
