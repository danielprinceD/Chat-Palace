const path = require("path");
const dotenv = require("dotenv");
const http = require("http");
const socketio = require("socket.io");
const static_loc = path.join(__dirname, "static");
const express = require("express");
const { Generate_Message } = require("./Utils/message");
dotenv.config();
console.log("Static File : ", static_loc);
const port = process.env.PORT || 5000;
const app = express();
const Server = http.createServer(app);
const io = socketio(Server);

io.on("connection", (sock) => {
  console.log("New User");
  sock.on("clientMsg", (msg, callback) => {
    console.log("From Client ", msg);
    callback("Server got the message");
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
    console.log("User Disconnected....!");
  });
});

app.use(express.static(static_loc));
Server.listen(port, () => {
  console.log("Server is Running...!");
});
