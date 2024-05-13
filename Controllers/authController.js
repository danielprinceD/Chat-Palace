const User = require("../Model/User");

module.exports.signup_get = (req, res) => {
  res.render("signup.html");
};
module.exports.login_get = (req, res) => {
  res.render("login.html");
};

// Post

module.exports.signup_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    const create = await User.create({
      email: email,
      password: password,
    });
    res.status(200).json(create);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ error: "user aldready exist" });
    res.status(400).send(err);
  }
};
module.exports.login_post = (req, res) => {
  res.send();
};
