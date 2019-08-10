const jwt = require('jsonwebtoken');
const { usergames, games, markers } = require('../../db/index').models;
const { generateMarkers } = require('../utils');

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
          socket.emit('newGame', JSON.stringify(pendingGames));
          console.log('lobby joined');
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
          const { id: gameId, playerCount, playerLimit, lat, long, markerLimit, radius } = game;
          await usergames.create({ userId, gameId });
          socket.leave('lobby');
          socket.join(room);
          socket.emit('join', `Congratulations you joined ${room}`);
          if (playerCount >= playerLimit) {
            await game.update({ state: 'playing' });
            const markerCoords = generateMarkers(lat, long, radius, markerLimit);
            const createMarkersArray = markerCoords.map((marker) => {
              const [markerLat, markerLong] = marker;
              return { lat: markerLat, long: markerLong, gameId };
            });
            const markerResults = await markers.bulkCreate(createMarkersArray);
            socket.emit('playing', markerResults);
            socket.to(room).emit('playing', markerResults);
          }
          const pendingGames = await games.findAll({
            where: {
              state: 'init',
            },
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
