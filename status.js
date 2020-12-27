const {query} = require("gamedig");
let recent = {};

module.exports = function(callback) {
  const states = [];

  const servers = require("./servers.json");

  servers.forEach(server => {
      query(server.server).then(state => {
        server.status = state;
        states.push(server);

        Object.keys(recent).forEach(p => {
          if(server.status.players.map(p => p.name).indexOf(p) === -1) {
            console.log("deleting");
            delete recent[p];
          }
        });

        server.status.players.map(p => p.name).forEach(p => {
          if(!recent.hasOwnProperty(p)) {
            console.log("creating");
            recent[p] = new Date();
          }
        });

        console.log(recent);

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
        server.status = null;
        states.push(server);

        if(states.length === servers.length) {
          callback(states);
        }
      });
  });
};
