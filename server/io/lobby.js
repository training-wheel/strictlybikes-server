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
          const { room, userId } = data;
          const game = await games.findOne({
            where: {
              code: room,
            },
          });
          const { id: gameId, userId: host } = game;
          await usergames.create({ userId, gameId });
          socket.leave('lobby');
          socket.join(room);
          socket.emit('join', `Congratulations you joined ${room}`);
          const pendingGames = await games.findAll({
            where: {
              state: 'init',
            },
          });
          if (userId === host) {
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
