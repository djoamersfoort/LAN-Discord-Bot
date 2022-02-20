// subclasses
const config = require("./config.json");
const getStatus = require("./status.js");
const makeEmbed = require("./embed.js");
const data = require("./data.js");

// globals
let message;
let channel;
let current = 0;

// imports
const Discord = require("discord.js");
const client = new Discord.Client();

// main function
client.on("ready", async () => {
  // set presence
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({activity: {name: "with game servers"}, status: "dnd"});

  // fetch channel and message
  channel = await client.channels.fetch(config.channel);
  const messageId = data("message");

  // try editing the message to avoid notifications
  // if editing failed send a new message instead
  try {
    message = await channel.messages.fetch(messageId);

    console.log(message.content);
    await message.edit("⏰ De gameservers worden geladen..", {embed: null});
  } catch(err) {
    console.log("Editing failed:", err);

    await channel.bulkDelete(99);
    message = await channel.send("⏰ De gameservers worden geladen..");
  }

  // save the message id in case it changed
  // (for example when sending a new message)
  data("message", message.id);

  setInterval(update, config.timeout);
  update();
});

// the update function
function update() {
  // sometimes discord breaks...
  // surrounded in a try/catch to avoid restarting
  try {
    // fetch servers and edit the message with the embed
    getStatus(servers => {
      const embed = makeEmbed(servers);
      message.edit("", {embed: embed});

      current += 1;
      if (typeof servers[current] === "undefined") current = 0;

      let quickString = `${servers[current].name} on ${servers[current].ip}`;
      if (servers[current].type === "online") {
        quickString += ` - Spelers ${s.status.players.length}/${s.status.maxplayers || s.maxPlayers}`;
      } else if (servers[current].type === "offline") {
        quickString += " - is offline!";
      }

      client.user.setPresence({activity: {name: quickString}, status: "dnd"});
    });
  } catch(err) {
    console.error("Failed to catch servers!", err);
  }
}

client.login(config.token);
