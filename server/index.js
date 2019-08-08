require('dotenv').config();
const restify = require('restify');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const {
  badges,
  conditions,
  markerlocations,
  markers,
  metrics,
  savedtrips,
  userbadges,
  users,
  usersmetrics,
} = require('../db/index').models;
const { JWT_SECRET, PORT } = process.env;

const server = restify.createServer({
  name: 'Strictly Bikes',
  version: '1.0.0',
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const validateUser = async (req, res, next) => {
  try {
    const token = req.header('jwt');
    const { id } = jwt.verify(token, JWT_SECRET);
    req.user = id;
    next();
  } catch (err) {
    res.send(400, `User not signed in: ${err.message}`);
  }
};

server.post('/login', async (req, res) => {
  try {
    const accessToken = req.header('authorization');
    const profile = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { name, email, picture: imageUrl } = profile.data;
    const sanitizedProfile = { name, email, imageUrl };
    const [user] = await users.findCreateFind({ where: sanitizedProfile });
    const { id } = user;
    const token = await jwt.sign({ id }, JWT_SECRET);
    res.send(201, token);
  } catch (err) {
    console.error(err);
    res.send(500);
  }
});

server.use(validateUser);

server.get('/', (req, res) => {
  res.send('~Strictly Bikes~');
});

const port = PORT || 3000;

server.listen(port, () => {
  console.log('%s listening at %s', server.name, server.url);
});
