const jwt = require('jsonwebtoken');
const {
  games, usergames, usermarkers, markers, users, metrics, usermetrics,
} = require('../../db/index').models;

class ActiveSocket {
  constructor(socket, server) {
    this.server = server;
    this.socket = socket;
    this.handlers = {
      gameStats: async (data) => {
        try {
          const {
            jwt: token, room, path: polyline, topSpeed,
          } = data;
          const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);
          const game = await games.findOne({
            where: {
              state: 'end',
              code: room,
            },
          });
          const { id: gameId } = game;
          usergames.update({ polyline }, {
            where: {
              userId,
              gameId,
            },
          });
          const { id: speedId } = await metrics.findOne({
            where: {
              name: 'topSpeed',
            },
          });
          const currentTopSpeed = await usermetrics.findCreateFind({
            where: {
              metricId: speedId,
              userId,
            },
          });
          if (topSpeed > currentTopSpeed.value) {
            currentTopSpeed.update({ value: topSpeed });
          }
        } catch (err) {
          console.error(`Failed to update polyline: ${err}`);
        }
      },
      markerHit: async (data) => {
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
          const { markerCount, team } = userGame;
          const game = await games.findOne({
            where: {
              id: gameId,
            },
          });
          const { markerLimit, code, mode } = game;
          const { username } = await users.findByPk(userId);
          const scorer = mode === 'teamsprint' ? team : username;
          if (markerCount === markerLimit) {
            this.socket.emit('end', scorer);
            this.socket.to(code).emit('end', scorer);
            await games.updateMetrics(game);
            game.update({
              state: 'end',
            });
          } else {
            this.socket.emit('hit', 'you');
            this.socket.to(code).emit('hit', scorer);
          }
        } catch (err) {
          console.error(`Marker hit error: ${err}`);
        }
      },
    };
  }
}

module.exports.ActiveSocket = ActiveSocket;
