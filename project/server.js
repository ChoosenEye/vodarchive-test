const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./modules/db");

const TwitchAPI = require("../modules/twitchapi");
const TwitchIRC = require("../modules/twitchIrc");

const twitchApi = new TwitchAPI();
const twitchIrc = new TwitchIRC();

let streamStartTime = null;

(async () => {
  await sequelize.sync();

  const app = express();
  app.use(bodyParser.json());

  require("../modules/rtmpWebhook")(app, {
    onStreamStart: (startTime) => {
      streamStartTime = startTime;
      twitchApi.start();
      twitchIrc.start();
    },

    onStreamEnd: async () => {
      twitchApi.stop();
      await twitchIrc.stop(streamStartTime);
    }
  });

  app.listen(3000, () => console.log("Server läuft auf Port 3000"));
})();
