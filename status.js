const {query} = require("gamedig");

module.exports = function(callback) {
  const states = [];

  const servers = require("./servers.json");

  servers.forEach(server => {
      query(server.server).then(state => {
        server.status = state;
        states.push(server);

        server.status.players = server.status.players.filter(p => (p.name !== undefined));

        if(states.length === servers.length) {
          callback(states);
        }
      }).catch(err => {
        server.status = null;
        states.push(server);

        if(states.length === servers.length) {
          callback(states);
        }
      });
  });
};
