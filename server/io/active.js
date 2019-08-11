const jwt = require('jsonwebtoken');
const {
  games, usergames, usermarkers, markers,
} = require('../../db/index').models;

const markerHit = async (data) => {
  //  create new game
  try {
    const { id: markerId, jwt: token } = data;
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    const { gameId, code } = await markers.findOne({ where: { markerId } });
    await usermarkers.create({ userId, markerId, gameId });
    const userGame = await usergames.findOne({
      where: {
        userId,
        gameId,
      },
    });
    await userGame.increment('markerCount');
    const { markerCount } = userGame;
    const { markerLimit } = await games.findByPk(gameId);
    const { name } = await usergames.findByPk(userId);
    if (markerCount === markerLimit) {
      this.socket.emit('end', name);
      this.socket.to(code).broadcast('end', name);
    } else {
      this.socket.to(code).broadcast('hit', name);
    }
  } catch (err) {
    console.error(`Marker hit error: ${err}`);
  }
};

class ActiveSocket {
  constructor(socket, server) {
    this.server = server;
    this.socket = socket;
    this.handlers = {
      createGame: markerHit.bind(this),
    };
  }
}

module.exports.ActiveSocket = ActiveSocket;
