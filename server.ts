const app = require("express")();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const connection = mongoose.connection;
const randomString = require("randomstring");
const cors = require("cors");
const colors = require("colors");
const mongodb = require("./config/mongodb.js");
const configFile = require("./config/config.js");
const config = configFile.config;
const date = new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set("json spaces", 4);

http.listen(3000, function () {
  console.log(colors.red("--------------------------------"));
  console.log(colors.red("Server has starting at"), colors.blue(date));
  console.log("Server host: ", colors.green("localhost:3000"));
  console.log("Server status: ", colors.green("Started"));
});

app.post("/api/auth/:email?/:psw?", (req, res) => {
  if (!req.query.email || !req.query.psw) {
    return res.json({
      error: true,
      auth: false,
      msg: "Empty login or password value",
    });
  } else {
    connection.db.collection("Accounts", (err, UsersCollection) => {
      UsersCollection.find({
        email: req.query.email,
        psw: req.query.psw,
      }).toArray((err, data) => {
        if (err) {
          return res.json({ error: true, auth: false, msg: err });
        } else {
          if (!data[0]) {
            return res.json({
              error: true,
              auth: false,
              msg: "Incorrect email or password",
            });
          } else {
            let date = new Date().toLocaleString("pl-PL", {
              timeZone: "Europe/Warsaw",
            });
            let handshake = randomString.generate();
            UsersCollection.updateOne({ _id: data[0]._id }, [
              { $set: { handshake: handshake } },
            ]);
            console.log(
              colors.grey(date),
              "|",
              "Account",
              colors.blue(data[0]._id),
              "has logged in from form."
            );
            return res.json({
              error: false,
              auth: true,
              id: data[0]._id,
              handshake: handshake,
              msg: "OK",
            });
          }
        }
      });
    });
  }
});

app.post("/api/auth_storage/:id?/:handshake?", (req, res) => {
  if (!req.query.id || !req.query.handshake) {
    return res.json({
      error: true,
      auth: false,
      msg: "Empty login or password value",
    });
  } else {
    connection.db.collection("Accounts", (err, UsersCollection) => {
      UsersCollection.find({
        _id: new ObjectId(req.query.id),
        handshake: req.query.handshake,
      }).toArray((err, data) => {
        if (err) {
          return res.json({ error: true, auth: false, msg: err });
        } else {
          if (!data[0]) {
            return res.json({
              error: true,
              auth: false,
              msg: "no logged-redirect to login page",
            });
          } else {
            let date = new Date().toLocaleString("pl-PL", {
              timeZone: "Europe/Warsaw",
            });
            let handshake = randomString.generate();
            UsersCollection.updateOne({ _id: data[0]._id }, [
              { $set: { handshake: handshake } },
            ]);
            console.log(
              colors.grey(date),
              "|",
              "Account",
              colors.blue(data[0]._id),
              "has logged in from local storage."
            );
            return res.json({
              error: false,
              auth: true,
              id: data[0]._id,
              handshake: handshake,
              msg: "OK",
            });
          }
        }
      });
    });
  }
});

app.post("/api/user/:id?", (req, res) => {
  if (!req.query.id) {
    console.log("Niepowodzenie pobrania danych usera");
    return res.json({
      error: true,
      msg: "Bad request",
    });
  } else {
    connection.db.collection("Accounts", (err, UsersCollection) => {
      UsersCollection.find({
        _id: new ObjectId(req.query.id),
      }).toArray((err, data) => {
        if (err) {
          return res.json({ error: true, msg: err });
        } else {
          if (!data[0]) {
            return res.json({
              error: true,
              msg: "No data",
            });
          } else {
            return res.json({
              error: false,
              res: data[0].data,
            });
          }
        }
      });
    });
  }
});

app.post("/api/book/:id?", (req, res) => {
  if (!req.query.id) {
    console.log("Niepowodzenie pobrania danych ksiazki");
    return res.json({
      error: true,
      msg: "Bad request",
    });
  } else {
    connection.db.collection("Books", (err, BooksCollection) => {
      BooksCollection.find({
        _id: new ObjectId(req.query.id),
      }).toArray((err, data) => {
        if (err) {
          return res.json({ error: true, msg: err });
        } else {
          if (!data[0]) {
            return res.json({
              error: true,
              msg: "No data",
            });
          } else {
            return res.json({
              error: false,
              res: data[0],
            });
          }
        }
      });
    });
  }
});

app.post("/api/createBook/:title?", (req, res) => {
  console.log(req.query.title);
  return res.json({ title: req.query.title });
});
