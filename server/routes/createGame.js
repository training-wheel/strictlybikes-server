const { Router } = require('restify-router');
const { games, users } = require('../../db/index').models;

const router = new Router();

const createGame = async (req, res) => {
  try {
    const userId = req.user;
    const options = req.body;
    options.userId = userId;
    await games.create(options);
    const user = await users.findByPk(userId);
    user.increment('gamesCreated');
    res.send({ userId });
  } catch (err) {
    console.error(`Failed to create game: ${err}`);
    res.send(500, 'Failed to create game');
  }
};

router.post('/createGame', createGame);

module.exports = router;
