const path = require("path");
const moment = require("moment");
const dotenv = require("dotenv");
const http = require("http");
const controller = require("./Controllers/authController");
const socketio = require("socket.io");
const static_loc = path.join(__dirname, "static");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const User = require("./Utils/user");
const express = require("express");
const router = require("./Route/auth_route");
const { Generate_Message } = require("./Utils/message");
const ValidSting = require("./Utils/ValidString");
dotenv.config();
console.log("Static File : ", static_loc);
const port = process.env.PORT || 5000;
const app = express();
const Server = http.createServer(app);
const io = socketio(Server);
const user = new User();
app.use(express.json());
app.use(cookieParser());

io.on("connection", (sock) => {
  sock.on("join", (params, callback) => {
    if (!ValidSting(params.name) || !ValidSting(params.room)) {
      return callback("Enter Valid Inputs");
    }

    sock.broadcast.to(params.room).emit("message", {
      from: "Admin",
      message: `${params.name} has joined the room`,
    });
    sock.join(params.room);
    user.removeUser(sock.id);
    user.addUser(sock.id, params.name, params.room);

    io.to(params.room).emit("people", user.get_list(params.room));

    sock.on("message", (msg, callback) => {
      sock.broadcast.to(params.room).emit("message", msg);
    });
  });

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

  sock.on("disconnect", () => {
    let current = user.removeUser(sock.id);

    if (current) {
      sock.to(current.room).emit("people", user.get_list(current.room));
      sock.to(current.room).emit("message", {
        from: "Admin",
        message: `${current.name} has left the room`,
      });
    }
  });
});

app.use("*", controller.checkuser);
app.use(express.static(static_loc));
Server.listen(port, () => {
  console.log(`Server is Running on Port ${port} ...!`);
  console.log(moment().format("LT"));
});

mongoose.connect(`${process.env.DB}`).then((res) => {
  console.log("DB Connected");
});

app.use(router);
