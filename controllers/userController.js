const { body, validationResult } = require("express-validator");
let User = require("../models/user");

// Display user create form on GET.
exports.create_user_get = function (req, res, next) {
  res.render("sign-up-form");
};

// Handle user create on POST.
exports.create_user_post = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username must be specified.")
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters."),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .escape()
    .withMessage("Password must be at least 8 characters"),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  // Process request after validation and sanitization.
  (req, res) => {
    // Create an User object with escaped and trimmed data.
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
];
