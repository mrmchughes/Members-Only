const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
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
    .withMessage("username is required")
    .isAlphanumeric()
    .withMessage("username must only include alpha-numeric characters"),
  body("password")
    .trim()
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters, include at least 1 lowercase letter, one uppercase letter, 1 number, and 1 symbol"
    ),
  body("confirmpassword").custom((value, { req }) => {
    console.log(value);

    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("sign-up-form", { errors: errors.array() });
    } else {
      const user = new User({
        username: req.body.username,
        password: req.body.password,
      }).save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect("/");
      });
    }
  },
];
