module.exports.signup_get = (req, res) => {
  res.render("signup.html");
};
module.exports.login_get = (req, res) => {
  res.render("login.html");
};

// Post

module.exports.signup_post = (req, res) => {
  res.send(req.body);
};
module.exports.login_post = (req, res) => {
  res.send();
};
