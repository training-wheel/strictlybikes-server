const { games, userGames } = require('../../db/index').models; 

const createGame = (data) => {
  //  create new game
  const gameOptions = {

  }
};

class ActiveSocket {
  constructor(socket, server) {
    this.server = server;
    this.socket = socket;
    this.handlers = {
      createGame: createGame.bind(this),
    };
  }
};

module.exports.ActiveSocket = ActiveSocket;
