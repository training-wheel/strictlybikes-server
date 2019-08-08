const { Router } = require('restify-router');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const { users } = require('../../db/index').models;

const router = new Router();

router.post('/login', async (req, res) => {
  try {
    const accessToken = req.header('authorization');
    const profile = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { name, picture: imageUrl } = profile.data;
    const sanitizedProfile = { name, imageUrl };
    const [user] = await users.findCreateFind({ where: sanitizedProfile });
    const { id } = user;
    const token = await jwt.sign({ id }, process.env.JWT_SECRET);
    res.send(201, token);
  } catch (err) {
    console.error(err);
    res.send(500);
  }
});

module.exports = router;
