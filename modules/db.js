const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../data/stream.db"),
  logging: false
});

const StreamStat = sequelize.define("StreamStat", {
  timestamp: { type: DataTypes.DATE, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false }
});

module.exports = { sequelize, StreamStat };
