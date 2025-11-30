module.exports = {
  rtmpRecordingPath: "/mnt/recordings/",

  twitch: {
    clientId: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    channel: "mantelmoritz",
    pollInterval: 60000 // alle 60s Stats holen
  },

  irc: {
    nick: "justinfan12345", // public anon login
    pass: "oauth:schrott",  // dummy
    channel: "mantelmoritz"
  }
};
