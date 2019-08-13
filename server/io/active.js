const jwt = require('jsonwebtoken');
const {
  games, usergames, usermarkers, markers, users,
} = require('../../db/index').models;

class ActiveSocket {
  constructor(socket, server) {
    this.server = server;
    this.socket = socket;
    this.handlers = {
      markerHit: async (data) => {
        //  create new game
        try {
          const { id: markerId, jwt: token } = data;
          const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);
          const { gameId } = await markers.findOne({ where: { id: markerId } });
          await usermarkers.create({ userId, markerId });
          const userGame = await usergames.findOne({
            where: {
              userId,
              gameId,
            },
          });
          await userGame.increment('markerCount');
          const { markerCount } = userGame;
          const game = await games.findOne({
            where: {
              id: gameId,
            },
            // include: [
            //   {
            //     model: markers,
            //     include: [
            //       {
            //         model: usermarkers,
            //         include: [
            //           {
            //             model: users,
            //           },
            //         ],
            //       },
            //     ],
            //   },
            // ],
          });
          const { markerLimit, code } = game;
          const { name } = await users.findByPk(userId);
          if (markerCount === markerLimit) {
            this.socket.emit('end', name);
            this.socket.to(code).emit('end', name);
          } else {
            this.socket.to(code).emit('hit', name);
          }
        } catch (err) {
          console.error(`Marker hit error: ${err}`);
        }
      },
    };
  }
}

module.exports.ActiveSocket = ActiveSocket;
