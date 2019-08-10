const { Router } = require('restify-router');
const { games } = require('../../db/index').models;

const router = new Router();

const createGame = (req, res) => {
  // const userId = req.user;
  const userId = 1;
  const options = req.body;
  options.userId = userId;
  games.create(options)
    .then(() => {
      res.send({ userId });
    })
    .catch((err) => {
      console.error(`Failed to create game: ${err}`);
      res.send(500, 'Failed to create game');
    });
};

router.post('/createGame', createGame);

module.exports = router;
