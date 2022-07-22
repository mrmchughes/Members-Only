const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

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
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render("sign-up-form", { errors: errors.array() });
      } else {
        let user = new User({
          username: req.body.username,
          password: hashedPassword,
          member: false,
          admin: false,
        }).save((err) => {
          if (err) {
            return next(err);
          }

          res.redirect("/");
        });
      }
    });
  },
];

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
      username: user.username,
      id: user.id,
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

    let user = new User({
      username: req.user.username,
      password: req.user.password,
      member: true,
      admin: false,
    });

    if (!errors.isEmpty()) {
      res.render("become-member-form", {
        username: user.username,
        id: user.id,
        member: user.member,
        errors: errors.array(),
      });
    } else {
      User.findByIdAndUpdate(req.params.id, user, {}, function (err) {
        if (err) {
          return next(err);
        }
        res.render("index", {
          username: user.username,
          id: user.id,
          member: user.member,
        });
      });
    }
  },
];
