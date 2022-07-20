let Message = require("../models/message");

// Display message create form on GET.
exports.create_message_get = function (req, res, next) {
  res.render("message-form");
};

// Handle message create on POST.
exports.create_message_post = function (req, res, next) {
  const message = new Message({
    title: req.body.title,
    message: req.body.message,
    user: req.user,
    timestamp: new Date(),
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
