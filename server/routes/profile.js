const { Router } = require('restify-router');
const { models, Sequelize, connection } = require('../../db/index');
const { Op } = Sequelize;
const { users, userbadges, badges, usermetrics, metrics } = models;

const router = new Router();

const getProfile = async (req, res) => {
  try {
    const { user: userId } = req;
    const { username, imageUrl } = await users.findByPk(userId);
    // const userBadgeIds = await userbadges.findAll({
    //   where: {
    //     userId,
    //   },
    //   attributes: ['badgeId'],
    // });
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
    const profile = {
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
