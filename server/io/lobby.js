const jwt = require('jsonwebtoken');
const { models, connection } = require('../../db/index');
const { generateMarkers } = require('../utils');

const { usergames, games, markers } = models;

class LobbySocket {
  constructor(socket, server) {
    this.server = server;
    this.socket = socket;
    this.handlers = {
      joinLobby: async () => {
        try {
          socket.join('lobby');
          const pendingGames = await games.findAll({
            where: {
              state: 'init',
            },
          });
          const pendingGameUsers = await pendingGames.map((pendingGame) => {
            const { id: currentGameId } = pendingGame;
            return connection
              .query(`SELECT users.username FROM users, usergames
                WHERE usergames."gameId" = ${currentGameId} AND users.id = usergames."userId"`);
          });
          const resolvedUsers = await Promise.all(pendingGameUsers);
          resolvedUsers.forEach((gameUsers, index) => {
            const [usernameObjects] = gameUsers;
            const usernames = usernameObjects.map(object => object.username);
            pendingGames[index].users = usernames;
          });
          socket.emit('newGame', JSON.stringify(pendingGames));
        } catch (err) {
          console.error(`Failed to join lobby: ${err}`);
        }
      },
      joinGame: async (data) => {
        try {
          const { room, jwt: token } = data;
          const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);
          const game = await games.findOne({
            where: {
              code: room,
              state: 'init',
            },
          });
          await game.increment('playerCount');
          const {
            id: gameId, playerCount, playerLimit, lat, long, markerLimit, radius,
          } = game;
          await usergames.create({ userId, gameId });
          socket.leave('lobby');
          socket.join(room);
          socket.emit('join', `Congratulations you joined ${room}`);
          if (playerCount >= playerLimit) {
            await game.update({ state: 'playing' });
            const markerCoords = await generateMarkers(lat, long, radius, markerLimit);
            const createMarkersArray = markerCoords.map((marker) => {
              const [markerLat, markerLong] = marker;
              return { lat: markerLat, long: markerLong, gameId };
            });
            const markersArray = await markers.bulkCreate(createMarkersArray, { returning: true });
            const [playersArray] = await connection
              .query(`SELECT users.username FROM users, usergames WHERE usergames."gameId" = ${gameId} AND users.id = usergames."userId"`);
            const players = playersArray.reduce((counter, player) => {
              const formattedPlayer = {
                username: player.username,
                score: 0,
              };
              counter.push(formattedPlayer);
              return counter;
            }, []);
            setTimeout(() => {
              socket.emit('playing', { markersArray, players });
              socket.to(room).emit('playing', { markersArray, players });
              setTimeout(() => {
                if (game.state !== 'end') {
                  this.socket.emit('end');
                  this.socket.to(room).emit('end');
                  games.updateMetrics(game);
                  game.update({
                    state: 'end',
                  });
                }
              }, game.timeLimit);
            }, 3000);
          }
          const pendingGames = await games.findAll({
            where: {
              state: 'init',
            },
          });
          const pendingGameUsers = await pendingGames.map((pendingGame) => {
            const { id: currentGameId } = pendingGame;
            return connection
              .query(`SELECT users.username FROM users, usergames
                WHERE usergames."gameId" = ${currentGameId} AND users.id = usergames."userId"`);
          });
          const resolvedUsers = await Promise.all(pendingGameUsers);
          resolvedUsers.forEach((gameUsers, index) => {
            const [usernameObjects] = gameUsers;
            const usernames = usernameObjects.map(object => object.username);
            pendingGames[index].users = usernames;
          });
          socket.to('lobby').broadcast.emit('newGame', JSON.stringify(pendingGames));
        } catch (err) {
          console.error(`Failed to join room: ${err}`);
        }
      },
    };
  }
}

exports.LobbySocket = LobbySocket;
