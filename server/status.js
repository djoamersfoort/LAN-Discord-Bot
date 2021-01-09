const {query} = require("gamedig");
let recent = {};

module.exports = function(callback) {
  const states = [];

  const servers = require("./servers.json");

  servers.forEach(server => {
      if(server.server === undefined) {
        server.type = "static";
        states.push(server);
        return;
      }

      query(server.server).then(state => {
        server.type = "online";
        server.status = state;
        states.push(server);

        Object.keys(recent).forEach(p => {
          if(server.status.players.map(p => p.name).indexOf(p) === -1) {
            delete recent[p];
          }
        });

        server.status.players.map(p => p.name).forEach(p => {
          if(!recent.hasOwnProperty(p)) {
            recent[p] = new Date();
          }
        });

        server.status.players = server.status.players
          .filter(p => (p.name !== undefined))
          .map(p => {
            p.time = recent[p.name];
            return p;
          });

        if(states.length === servers.length) {
          callback(states);
        }
      }).catch(err => {
        server.type = "offline";
        states.push(server);

        if(states.length === servers.length) {
          callback(states);
        }
      });
  });
};
