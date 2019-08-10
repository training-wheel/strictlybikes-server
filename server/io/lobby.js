const jwt = require('jsonwebtoken');
const { usergames, games } = require('../../db/index').models;

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
            },
          });
          game.increment('playerCount');
          const { id: gameId, userId: host, playerCount, playerLimit } = game;
          await usergames.create({ userId, gameId });
          socket.leave('lobby');
          socket.join(room);
          socket.emit('join', `Congratulations you joined ${room}`);
          if (playerCount === playerLimit) {
            game.update({ state: 'playing' });
            socket.to(room).broadcast.emit('playing', 'Get ready to bike!');
          }
          if (userId === host) {
            const pendingGames = await games.findAll({
              where: {
                state: 'init',
              },
            });
            socket.to('lobby').broadcast.emit('newGame', JSON.stringify(pendingGames));
          }
        } catch (err) {
          console.error(`Failed to join room: ${err}`);
        }
      },
    };
  }
}

exports.LobbySocket = LobbySocket;
