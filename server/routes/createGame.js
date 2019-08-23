const { Router } = require('restify-router');
const { games, users, badges, userbadges, metrics, usermetrics } = require('../../db/index').models;

const router = new Router();

const createGame = async (req, res) => {
  try {
    const userId = req.user;
    const options = req.body;
    options.userId = userId;
    await games.create(options);
    const gamesCreatedMetric = await metrics.findOne({
      where: {
        name: 'gamesCreated',
      },
    });
    const [gamesCreatedUserMetric] = await usermetrics.findCreateFind({
      where: {
        metricId: gamesCreatedMetric.id,
        userId,
      },
    });
    await gamesCreatedUserMetric.increment('value');
    const gamesCreatedBadge = await badges.findOne({
      where: {
        metricId: gamesCreatedMetric.id,
        goal: gamesCreatedUserMetric.value,
      },
    });
    if (gamesCreatedBadge) {
      const { id: badgeId } = gamesCreatedBadge;
      userbadges.create({ userId, badgeId });
    }
    res.send({ userId });
  } catch (err) {
    console.error(`Failed to create game: ${err}`);
    res.send(500, 'Failed to create game');
  }
};

router.post('/createGame', createGame);

module.exports = router;
