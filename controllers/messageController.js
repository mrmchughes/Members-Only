const Message = require("../models/message");

// Display message create form on GET.
exports.create_message_get = function (req, res) {
  res.render("message-form", { user: req.user });
};

// Handle message create on POST.
exports.create_message_post = function (req, res, next) {
  const message = new Message({
    title: req.body.title,
    message: req.body.message,
    user: req.user.username,
    timestamp: new Date(),
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

// Handle message delete on POST.
exports.delete_message_post = function (req, res, next) {
  Message.findByIdAndRemove(req.body.messageid, function deleteMessage(err) {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
};
