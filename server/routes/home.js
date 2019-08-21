const { Router } = require('restify-router');
const { users } = require('../../db/index').models;

const router = new Router();

const profileImage = async (req, res) => {
  try {
    const userId = req.user;
    const { imageUrl } = await users.findByPk(userId);
    res.send(200, imageUrl);
  } catch (err) {
    console.error(`Failed to fetch profile image: ${err}`);
    res.send(500, 'Failed to fetch profile image');
  }
};

router.get('/profileImage', profileImage);

module.exports = router;
