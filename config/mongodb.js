const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const configFile = require("./config.js");
const config = configFile.config;
const colors = require("colors");

mongoose.connect(
  "mongodb://" +
    config.db.username +
    ":" +
    config.db.password +
    "@" +
    config.db.host +
    ":" +
    config.db.port +
    "/" +
    config.db.database,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    const state = Number(mongoose.connection.readyState);
    console.log("MongoDB host: ", "195.167.159.167:27017".blue);
    console.log(
      "MongoDB status: ",
      dbState.find((f) => f.value == state).label.green
    );
    console.log(colors.red("--------------------------------"));
  }
);

var dbState = [
  {
    value: 0,
    label: "disconnected",
  },
  {
    value: 1,
    label: "Connected",
  },
  {
    value: 2,
    label: "connecting",
  },
  {
    value: 3,
    label: "disconnecting",
  },
];
