const { body, validationResult } = require("express-validator");
const User = require("../models/user");

// Display Become Member form on GET.
exports.become_member_get = function (req, res, next) {
  User.findById(req.user.id, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user == null) {
      let err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.render("become-member-form", {
      user: user.username,
      member: user.member,
    });
  });
};

// Handle User Becoming Member on POST.
exports.become_member_post = [
  // Validate and sanitize fields.
  body("membershipCode").custom((value, { req }) => {
    console.log(value);

    if (value != 1234) {
      throw new Error("Sorry, the Membership Code was wrong");
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validationResult(req);

    // Update user member status
    const user = new User({
      member: true,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("become-member-form", {
        user: user.username,
        member: user.member,
        errors: errors.array(),
      });
      return;
    } else {
      User.findByIdAndUpdate(req.params.id, user, function (err) {
        if (err) {
          return next(err);
        }

        res.redirect("/");
      });
    }
  },
];
