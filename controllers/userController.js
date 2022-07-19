let User = require("../models/user");

// Display user create form on GET.
exports.create_user_get = function (req, res, next) {
  res.render("sign-up-form");
};

// Handle user create on POST.
exports.create_user_post = function (req, res, next) {
  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password: req.body.password,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
