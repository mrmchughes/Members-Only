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
    .withMessage("Username must be specified."),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .escape()
    .withMessage("Password must be at least 8 characters"),
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
      return res.status(400).redirect("/sign-up");
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
