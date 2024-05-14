const { response } = require("express");
const User = require("../Model/User");
const jwt = require("jsonwebtoken");

module.exports.signup_get = (req, res) => {
  res.render("signup.html");
};
module.exports.login_get = (req, res) => {
  res.render("login.html");
};

// Post

// createToken

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "daniel secret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const create = await User.create({
      email: email,
      password: password,
    });
    const token = createToken(create._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user: create._id });
  } catch (err) {
    console.log(err.code);
    if (err.code === 11000)
      res.status(400).json({ error: "user aldready exist" });
    else {
      console.log(err);
      res.status(400).json(err);
    }
  }
};
module.exports.login_post = async (req, res) => {
  try {
    const obj = new Object(req.body);
    const user = await User.login(obj.email, obj.password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge,
    });
    res.status(200).json({ user: user._id, email: obj.email });
  } catch (err) {
    const text = err + " ";
    res.status(400).json({ error: text });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login.html");
};

module.exports.checkuser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "daniel secret", async (err, decodedToken) => {
      var user = null;
      if (err) {
        res.locals.user = null;
        res.redirect("/login");
      } else {
        user = await User.findById(decodedToken.id);
      }
      res.locals.user = user;
      next();
    });
  } else {
    next();
  }
};
