const config = require("./config.json");
const getStatus = require("./status.js");
const makeEmbed = require("./embed.js");

let message;
let channel;

module.exports = async function(client) {
  channel = await client.channels.cache.get(config.channel);
  await channel.bulkDelete(99);
  message = await channel.send("⏰ De gameservers worden geladen..");

  setInterval(update, config.timeout);
  update();
};

function update() {
  getStatus(servers => {
    try {
      const embed = makeEmbed(servers);
      message.edit("", {embed: embed});
    } catch(err) {
      console.error(err);
    }
  });
}
