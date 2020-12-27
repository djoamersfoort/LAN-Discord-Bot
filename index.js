const config = require("./config.json");

const Discord = require("discord.js");
const client = new Discord.Client();

const getStatus = require("./status.js");
const makeEmbed = require("./embed.js");

let message = null;
let channel = null;

let oldList = [];

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({activity: {name: "with game servers"}, status: "dnd"});

  channel = await client.channels.cache.get(config.channel);
  await channel.bulkDelete(99);
  message = await channel.send("⏰ De gameservers worden geladen..");

  setInterval(update, config.timeout);
  update(channel);
});

function update() {
  getStatus(servers => {
    const embed = makeEmbed(servers);
    message.edit("", {embed: embed});
  });
}

client.login(config.token);
