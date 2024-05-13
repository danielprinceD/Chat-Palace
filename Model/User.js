const mongoose = require("mongoose");
const { isEmail } = require("validator");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

const Users = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter Email"],
    unique: [true, "Users is Already Exists"],
    lowercase: true,
    validate: [isEmail, "Please enter valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter Password"],
    minLength: [6, "Must contain minimum 6 Character"],
  },
});

Users.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("user", Users);

module.exports = User;
