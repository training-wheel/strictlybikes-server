require('dotenv').config();
const restify = require('restify');

const server = restify.createServer({
  name: 'Strictly Bikes',
  version: '1.0.0',
});

const io = require('socket.io')(server);

const validateUser = require('./middleware/validateUser');

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const loginRoute = require('./routes/login');

loginRoute.applyRoutes(server);

server.get('/', validateUser, (req, res) => {
  res.send('~Strictly Bikes~');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('%s listening at %s', server.name, server.url);
});
