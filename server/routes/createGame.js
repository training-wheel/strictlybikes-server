/**
 * createGame is the server route for the POST request that actually
 * inserts a new game into the database. It is exported to the
 * server/index.js file.
 */

/**
 * Router is a constructor required to route the endpoint to the main server
 * Database models are required for database queries
 */

const { Router } = require('restify-router');
const {
  games, badges, userbadges, metrics, usermetrics,
} = require('../../db/index').models;

/**
 * router is a new instance of the Router constuctor
 */

const router = new Router();

/**
 * createGame is a callback function designed to insert a new game into the
 * database and update any necessary stats.
 *
 * @param {Object} req: The HTTP request object. We grab the userId and game
 * options for game creation.
 * @param {Object} res: The HTTP response object. Here we send back the userId.
 */

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

/**
 * Apply the createGame route and export it to the server.index file
 */

router.post('/createGame', createGame);

module.exports = router;
