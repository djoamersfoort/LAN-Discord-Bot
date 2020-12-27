const {MessageEmbed} = require("discord.js");

module.exports = function(states) {
  const dateString = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

  const embed = new MessageEmbed()
    .setTitle("DJO Gameserver Lijst")
    .setColor("PURPLE")
    .setDescription("Speel mee op **mc.djoamersfoort.nl**")
    .setFooter(dateString)
    .addFields(states.map(s => {
      const online = s.status !== null;

      let name = `${online ? s.icon : "❌"} ${s.name}`;
      let value;

      if(online) {
        value = "**Ping:** " + s.status.ping + "ms\n";
        value += `**Spelers:** ${s.status.players.length}/${s.status.maxplayers || s.maxPlayers}\n`;
        value += s.status.players.map(p => ` • ${p.name}`).join("\n");
      } else {
        value = "Server is offline.";
      }

      return {
        name: name,
        value: value,
        inline: false
      };
    }));

    return embed;
};
