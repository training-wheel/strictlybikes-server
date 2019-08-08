const newGame = () => {
  //  insert code
};

class LobbySocket {
  constructor(socket, server) {
    this.server = server;
    this.socket = socket;
    this.handlers = {
      newGame: newGame.bind(this),
    };
  }
}

module.exports.LobbySocket = LobbySocket;
