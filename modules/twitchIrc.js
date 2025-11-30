const tmi = require("tmi.js");
const fs = require("fs");
const path = require("path");
const config = require("../project/config");

module.exports = class TwitchIRC {
  constructor() {
    this.chat = [];
    this.client = new tmi.Client({
      connection: { secure: true, reconnect: true },
      identity: {
        username: config.irc.nick,
        password: config.irc.pass
      },
      channels: [config.irc.channel]
    });
  }

  start() {
    this.client.on("message", (channel, tags, message) => {
      this.chat.push({
        timestamp: new Date().toISOString(),
        user: tags["display-name"],
        message
      });
    });

    this.client.connect();
    console.log("IRC Chat logging started");
  }

  async stop(startTime) {
    console.log("IRC Chat logging stopped");

    const filename = `chat_${startTime.toISOString().replace(/[:.]/g, "-")}.json`;
    const filepath = path.join(__dirname, "../data/chat_logs/", filename);

    fs.writeFileSync(filepath, JSON.stringify(this.chat, null, 2));
  }
};
