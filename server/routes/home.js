/**
 * home.js contains the profileImage route and callback function
 * It is exported to the server/index file.
 */

/**
 * Router is a constructor function used to route routes
 * users is required to query the users table
 */

const { Router } = require('restify-router');
const { users } = require('../../db/index').models;

/**
 * router is an instance of the Router constructor
 */

const router = new Router();

/**
 * profileImage is a callback function applied to the GET /profileImage route
 * It takes the req and res objects.
 *
 * @param {Object} req: The HTTP request object. The userId is destructured out.
 * @param {Object} res: The HTTP response object. The user's profile image and
 * username are attached.
 */

const profileImage = async (req, res) => {
  try {
    const userId = req.user;
    const { imageUrl, username } = await users.findByPk(userId);
    res.send(200, { imageUrl, username });
  } catch (err) {
    console.error(`Failed to fetch profile image: ${err}`);
    res.send(500, 'Failed to fetch profile image');
  }
};

/**
 * The /profileImage route is applied to the router and exported
 */

router.get('/profileImage', profileImage);

module.exports = router;
