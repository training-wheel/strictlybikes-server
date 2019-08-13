require('dotenv').config();
const restify = require('restify');
const socketio = require('socket.io');

const server = restify.createServer({
  name: 'Strictly Bikes',
  version: '1.0.0',
});

const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const createGame = require('./routes/createGame');
const validateUser = require('./middleware/validateUser');

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

loginRoute.applyRoutes(server);
signupRoute.applyRoutes(server);
createGame.use(validateUser);
createGame.applyRoutes(server);

server.get('/', validateUser, (req, res) => {
  res.send('~Strictly Bikes~');
});

const io = socketio.listen(server.server);
const { LobbySocket } = require('./io/lobby');
const { ActiveSocket } = require('./io/active');

io.sockets.on('connect', (socket) => {
  console.log('connected');
  const eventHandlers = {
    lobby: new LobbySocket(socket, server.server),
    active: new ActiveSocket(socket, server.server),
  };
  // const categories = Object.keys(eventHandlers);
  // const handlers = categories.map(category => eventHandlers[category].handlers);
  // const events = Object.keys(handlers);
  // events.forEach((event) => {
  //   socket.on(event, handlers[event]);
  // });
  for (let category in eventHandlers) {
    const { handlers } = eventHandlers[category];
    for (let event in handlers) {
      socket.on(event, handlers[event]);
    }
  }
  socket.on('error', (err) => {
    console.error(`Socket error: ${err}`);
  });
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    socket.removeAllListeners();
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('%s listening at %s', server.name, server.url);
});
