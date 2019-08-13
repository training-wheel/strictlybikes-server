const { Router } = require('restify-router');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { users } = require('../../db/index').models;

const router = new Router();

router.post('/signup', async (req, res) => {
  try {
    const { accessToken, username } = req.body;
    const profile = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { name, picture: imageUrl, googleId } = profile.data;
    const sanitizedProfile = {
      name, imageUrl, username, googleId,
    };
    const { id } = await users.create(sanitizedProfile);
    const token = await jwt.sign({ id }, process.env.JWT_SECRET);
    res.send(201, token);
  } catch (err) {
    console.error(`Signup failed: ${err}`);
    res.send(500, 'Signup failed');
  }
});

module.exports = router;
