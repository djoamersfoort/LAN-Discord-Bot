const config = require("./config.json");
const https = require("https");
let channel;

module.exports = async function(client) {
  channel = await client.channels.cache.get(config.channel);
  await channel.bulkDelete(99);

  setInterval(update, config.timeout);
  update();
};

const publishers = {
  steam: {
    icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/1024px-Steam_icon_logo.svg.png",
    text: "Steam"
  },
  epic: {
    icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Epic_Games_logo.svg/882px-Epic_Games_logo.svg.png",
    text: "Epic Games"
  },
  // ps: {
  //   icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/1200px-Playstation_logo_colour.svg.png",
  //   text: "Playstation"
  // },
  // xbox: {
  //   icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Xbox_logo_2012_cropped.svg/1200px-Xbox_logo_2012_cropped.svg.png",
  //   text: "Xbox"
  // },
  unknown: {
    icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_(black).svg/768px-Question_mark_(black).svg.png",
    text: "Other"
  }
};

const platforms = {
  win: "Windows",
  mac: "Mac",
  linux: "Linux"
};

function makeEmbed(g) {
  return {
    title: g.title,
    description: "Available on " + g.platform.split("/").map(i => platforms[i]).join(", ").replace(/(.+)\, /g, "$1 & "),
    url: g.url_store,
    color: "PURPLE",
    timestamp: new Date().toISOString(),
    footer: publishers[g.publisher_id] || publishers.unknown,
    image: {
      url: g.thumbnail_file
    }
  };
}

function update() {
  https.get("https://gx.opera-api.com/api/v1/games?country=nl&language=nl", res => {
    let d = "";
    res.on("data", b => d += b);
    res.on("end", async () => {
      const json = JSON.parse(d);
      const section = json.sections.filter(s => s.id === "free_games")[0];

      await channel.bulkDelete(99);

      const games = section.items.filter(g => /win|mac/.test(g.platform));

      games.forEach(async g => {
        await channel.send("", {embed: makeEmbed(g)});
      });
    });
    res.on("error", err => {
      console.error(err);
    });
  });
};
