const fs = require("fs");
const path = require("path");
const config = require("../project/config");

module.exports = function (app, handlers) {

  app.post("/rtmp/start", async (req, res) => {
    console.log("RTMP STREAM START");

    // Neueste Datei im Aufnahmeordner suchen
    const files = fs.readdirSync(config.rtmpRecordingPath)
      .filter(f => f.endsWith(".mp4"));
    
    const newest = files
      .map(f => ({
        file: f,
        time: fs.statSync(path.join(config.rtmpRecordingPath, f)).mtime
      }))
      .sort((a, b) => b.time - a.time)[0];

    const startTime = newest ? newest.time : new Date();

    handlers.onStreamStart(startTime);

    res.json({ status: "ok", startTime });
  });

  app.post("/rtmp/end", async (req, res) => {
    console.log("RTMP STREAM END");

    await handlers.onStreamEnd();

    res.json({ status: "ok" });
  });
};
