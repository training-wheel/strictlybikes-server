const { usergames, games } = require('../../db/index').models;


class LobbySocket {
  constructor(socket, server) {
    this.server = server;
    this.socket = socket;
    this.handlers = {
      joinGame: async (data) => {
        try {
          const { room, userId } = data;
          const game = await games.findOne({
            where: {
              code: room,
            },
          });
          const { id: gameId } = game;
          await usergames.create({ userId, gameId });
          socket.join(room);
          socket.to(room).emit('join', `Congratulations you joined ${room}`);
          socket.to('lobby').emit('newGame', JSON.stringify(game));
        } catch (err) {
          console.error(`Failed to join room: ${err}`);
        }
      },
    };
  }
};

exports.LobbySocket = LobbySocket;
