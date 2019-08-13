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
    const { id: googleId } = profile.data;
    const user = await users.findOne({ googleId });
    if (user) {
      const { id } = user;
      const token = await jwt.sign({ id }, process.env.JWT_SECRET);
      res.send(200, { token });
    } else {
      res.send(200, { accessToken });
    }
  } catch (err) {
    console.error(err);
    res.send(500);
  }
});

module.exports = router;
