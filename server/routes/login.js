/**
 * login.js holds the POST to /login route and callback function.
 * This route is exported to server/index.js
 */

/**
 * Router is a constructor function for creating routes
 * axios is required to ping Google for authorization
 * jwt is required to manage JSON Web Tokens
 * users is required to query the users table
 */

const { Router } = require('restify-router');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { users } = require('../../db/index').models;

/**
 * router is an instance of the Router constructor
 */

const router = new Router();

/**
 * login is a callback function that checks if a user exists and, if so,
 * creates a JSON Web Token for them. If they do not exist, the access token
 * is sent back to the user for sign up.
 *
 * @param {Object} req: The HTTP request object. The google access token is
 * taken from the header.
 * @param {Object} res: The HTTP response object. If the user already exists, the
 * new JSON Web Token is attached. Else, the google accessToken is attached.
 */

const login = async (req, res) => {
  try {
    const accessToken = req.header('authorization');
    const profile = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { id: googleId } = profile.data;
    const user = await users.findOne({ where: { googleId } });
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
};

/**
 * Apply the login callback to the route and export the router to the server
 */

router.post('/login', login);

module.exports = router;
