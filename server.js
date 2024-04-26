const path = require("path");
const dotenv = require("dotenv");
const static_loc = path.join(__dirname, "static");
const home = path.join(static_loc, "index.html");
const express = require("express");
dotenv.config();
console.log("Static File : ", static_loc);
const port = process.env.PORT || 5000;
const app = express();
app.use(express.static(home));

app.listen(port, () => {
  console.log("Server is Running...!");
});
