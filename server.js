const path = require("path");
const moment = require("moment");
const dotenv = require("dotenv");
const http = require("http");
const socketio = require("socket.io");
const static_loc = path.join(__dirname, "static");
const User = require("./Utils/user");
const express = require("express");
const { Generate_Message } = require("./Utils/message");
const ValidSting = require("./Utils/ValidString");
dotenv.config();
console.log("Static File : ", static_loc);
const port = process.env.PORT || 5000;
const app = express();
const Server = http.createServer(app);
const io = socketio(Server);
const user = new User();

io.on("connection", (sock) => {
  sock.on("join", (params, callback) => {
    if (!ValidSting(params.name) || !ValidSting(params.room)) {
      return callback("Enter Valid Inputs");
    }
    console.log(sock.id);
    sock.join(params.room);
    user.removeUser(sock.id);
    user.addUser(sock.id, params.name, params.room);
    console.log(user.users, "**");
    sock.on("message", (msg, callback) => {
      console.log(msg);
      sock.broadcast.to(params.room).emit("message", msg);
    });
  });

  console.log("New User");
  sock.on("clientMsg", (msg, callback) => {
    console.log("From Client ", msg);
    callback("Server got the message");
  });

  sock.on("location", (msg, callback) => {
    io.emit("message", {
      from: "Admin",
      message: `${msg.lat} ${msg.long}`,
      url: `https://www.google.com/maps?q=${msg.lat} , ${msg.long}`,
    });
  });

  sock.broadcast.emit("for_all", Generate_Message("Admin", "Good Morning"));
  sock.emit(
    "serverMsg",
    Generate_Message("Server", "Hello Buddy ...!"),
    (msg) => {
      console.log("Are You User ?");
      console.log(msg);
    }
  );
  sock.on("disconnect", () => {
    user.removeUser(sock.id);
    console.log("User Disconnected....!");
  });
});

app.use(express.static(static_loc));
Server.listen(port, () => {
  console.log(`Server is Running on Port ${port} ...!`);
  console.log(moment().format("LT"));
});
