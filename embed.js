const {MessageEmbed} = require("discord.js");

// function to get a "time since" value
function getTimeSince(date) {
  const difference = new Date() - date;

  // get the time in units
  const milliseconds = parseInt((difference % 1000) / 100);
  const seconds = Math.floor((difference / 1000) % 60);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

  // only have prefixes if the unit is > 0
  const hours_s = hours + "h";
  const minutes_s = minutes + "m";
  const seconds_s = seconds + "s";

  // the returned message
  // send "joined" if the time is 0 (they just joined)
  const out = (hours > 0 ? hours_s : "") + (minutes > 0 ? minutes_s : "") + (seconds > 0 ? seconds_s : "");
  return out === "" ? "joined" : out;
}

// main exports function
module.exports = function(states) {
  // build the embed using the discord embed builder
  const embed = new MessageEmbed()
    .setTitle("DJO Gameserver Lijst")
    .setColor("PURPLE")
    .setDescription("Voel je vrij om te joinen!")
    .setTimestamp(new Date().toISOString())

    // the fields containing the server
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
