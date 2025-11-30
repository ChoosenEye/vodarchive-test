const axios = require("axios");
const config = require("../project/config");
const { StreamStat } = require("./db");

module.exports = class TwitchAPI {
  constructor() {
    this.token = null;
    this.timer = null;
  }

  async getToken() {
    const res = await axios.post("https://id.twitch.tv/oauth2/token", null, {
      params: {
        client_id: config.twitch.clientId,
        client_secret: config.twitch.clientSecret,
        grant_type: "client_credentials"
      }
    });

    this.token = res.data.access_token;
  }

  async pollStats() {
    if (!this.token) await this.getToken();

    const res = await axios.get(
      "https://api.twitch.tv/helix/streams",
      {
        headers: {
          "Client-ID": config.twitch.clientId,
          "Authorization": `Bearer ${this.token}`
        },
        params: { user_login: config.twitch.channel }
      }
    );

    const data = res.data.data[0];
    if (!data) return;

    await StreamStat.create({
      timestamp: new Date(),
      title: data.title
   });
  }

  start() {
    console.log("Twitch API polling started");
    this.timer = setInterval(() => this.pollStats(), config.twitch.pollInterval);
  }

  stop() {
    console.log("Twitch API polling stopped");
    clearInterval(this.timer);
  }
};
