/**
 * dotenv required for accessing secrets
 * restify required for managing the server
 * socketio required to implement sockets
 */

require('dotenv').config();
const restify = require('restify');
const socketio = require('socket.io');

/**
 * server is a basic server, passed a name and a version
 */

const server = restify.createServer({
  name: 'Strictly Bikes',
  version: '1.0.0',
});

/**
 * Require all of the server endpoints
 * loginRoute is the login endpoint
 * signupRoute is to sign up new users
 * createGame is the initial endpoint to create a new race
 * getProfile fetches all user information for the profile page
 * homeData fetches basic user information for game functionality
 */

const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const createGame = require('./routes/createGame');
const getProfile = require('./routes/profile');
const homeData = require('./routes/home');

/**
 * validateUser is middleware to ensure a user is logged in
 */

const validateUser = require('./middleware/validateUser');

/**
 * Apply basic parsing middleware to the server
 */

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

/**
 * Apply all of the routes to the main server
 * Note that loginRoute and signupRoute do not need validateUser
 */

loginRoute.applyRoutes(server);
signupRoute.applyRoutes(server);
createGame.use(validateUser);
getProfile.use(validateUser);
homeData.use(validateUser);
createGame.applyRoutes(server);
getProfile.applyRoutes(server);
homeData.applyRoutes(server);

const io = socketio.listen(server.server);
const { LobbySocket } = require('./io/lobby');
const { ActiveSocket } = require('./io/active');

io.sockets.on('connect', (socket) => {
  console.log('connected');
  const eventHandlers = {
    lobby: new LobbySocket(socket, server.server),
    active: new ActiveSocket(socket, server.server),
  };
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
