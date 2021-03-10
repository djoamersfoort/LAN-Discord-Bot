// this makes use of gamedig and supports most gameservers
const {query} = require("gamedig");
let recent = {}; // stores "playing since" data

// main exports function
module.exports = function(callback) {
  // get the servers from config file
  const states = [];
  const servers = require("./servers.json");

  // loop through servers
  servers.forEach(server => {
    // server is not pingable by gamedig
    // some servers like Factorio have this
    if(server.server === undefined) {
      server.type = "static";
      states.push(server);
      return;
    }

    // store new players in recent
    if(!recent.hasOwnProperty(server.name)) {
      recent[server.name] = {};
    }

    // ping the server
    query(server.server).then(state => {
      // set the server online
      server.type = "online";
      server.status = state;
      states.push(server);

      // get time since playing for players
      Object.keys(recent[server.name]).forEach(p => {
        if(server.status.players.map(p => p.name).indexOf(p) === -1) {
          delete recent[server.name][p];
        }
      });

      server.status.players.map(p => p.name).forEach(p => {
        if(!recent[server.name].hasOwnProperty(p)) {
          recent[server.name][p] = new Date();
        }
      });

      server.status.players = server.status.players
        .filter(p => (p.name !== undefined))
        .map(p => {
          p.time = recent[server.name][p.name];
          return p;
        });

      // if the last one: return
      if(states.length === servers.length) {
        callback(states);
      }
    }).catch(err => {
      // the server is offline!
      server.type = "offline";
      states.push(server);

      // if the last one: return
      if(states.length === servers.length) {
        callback(states);
      }
    });
  });
};
