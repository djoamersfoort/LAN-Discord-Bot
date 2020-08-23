const {MessageEmbed} = require("discord.js");
const {query} = require("gamedig");

function parseEmbed(states) {
  const embed = new MessageEmbed()
    .setTitle("DJO Game Server Status")
    .setColor("BLURPLE")
    .setDescription("Hieronder is een lijst van gameservers met spelers.")
    .setTimestamp()
    .addFields(states.map(s => {
      const stat = s.status;

      return {
        name: `${s.name} (${stat.players.length}/${stat.maxplayers})`,
        value: stat.players > 0 ? (s.status.players.map(p => ` • ${p}`).join("\n")) : "Er speelt niemand.",
        inline: true
      };
    }));

    return embed;
}

module.exports = function(callback) {
  const embed = new MessageEmbed();
  const states = [];

  const servers = require("./servers.json");

  servers.forEach((server) => {
      query(server).then(state => {
        states.push({name:server.type, status:state});

        if(states.length === servers.length) {
          callback(parseEmbed(states));
        }
      }).catch(err => {
        console.error(err);
        return null;
      });
  });
};
