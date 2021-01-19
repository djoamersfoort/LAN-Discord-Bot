const {MessageEmbed} = require("discord.js");
const config = require("./config.json");

function getTimeSince(date) {
  const diff = Math.floor((new Date() - date) / 1000);

  const hours = Math.floor(diff / (60 * 60));
  const minutes = Math.floor(diff / 60) - hours * 60 * 60;
  const seconds = diff - hours * 60 * 60 - minutes * 60;

  const hours_s = hours + "h";
  const minutes_s = minutes + "m";
  const seconds_s = seconds + "s";

  const out = (hours > 0 ? hours_s : "") + (minutes > 0 ? minutes_s : "") + (seconds > 0 ? seconds_s : "");

  return out === "" ? "joined" : out;
}

module.exports = function(states) {
  const dateString = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

  const embed = new MessageEmbed()
    .setTitle("DJO Gameserver Lijst")
    .setColor("PURPLE")
    .setDescription("Voel je vrij om te joinen!")
    .setTimestamp(new Date().toISOString())

    .addFields(states.map(s => {
      const name = `${s.icon} ${s.name}`;
      let value = `*${s.ip}*\n`;

      if(s.type === "online") {
        value += "**Ping:** " + s.status.ping + "ms\n";
        value += `**Spelers:** ${s.status.players.length}/${s.status.maxplayers || s.maxPlayers}\n`;
        value += s.status.players.map(p => ` • ${p.name} *(${getTimeSince(p.time)})*`).join("\n");
      } else if(s.type === "offline") {
        value = "*Server is offline.*";
      }

      return {
        name: name,
        value: value,
        inline: false
      };
    }));

    return embed;
};
