/**
 * Authentication middleware exported to the server/index
 */

/**
 * jwt required to verify user's web token
 */

const jwt = require('jsonwebtoken');

/**
 * validateUser is a middleware function to verify users before granting
 * access to sensitive endpoints
 * @param {Object} req: The HTTP request object. The web token is attached in
 * the header. The decrypted user ID is attached to the user property.
 * @param {Object} res: The HTTP response object.
 * @param {Function} next: The next callback function to be invoked.
 */

const validateUser = async (req, res, next) => {
  try {
    const token = req.header('jwt');
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = id;
    next();
  } catch (err) {
    console.error(`User not logged in: ${err}`);
    res.send(400, `User not signed in: ${err.message}`);
  }
};

/**
 * The middleware is exported to server/index
 */

module.exports = validateUser;
