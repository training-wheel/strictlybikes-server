const jwt = require('jsonwebtoken');

const validateUser = async (req, res, next) => {
  try {
    const token = req.header('jwt');
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = id;
    next();
  } catch (err) {
    res.send(400, `User not signed in: ${err.message}`);
  }
};

module.exports = validateUser;
