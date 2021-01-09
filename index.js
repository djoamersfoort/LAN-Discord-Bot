const config = require("./config.json");

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({activity: {name: "with game servers"}, status: "dnd"});

  require("./server/index.js")(client);
  require("./games/index.js")(client);
});

client.login(config.token);
