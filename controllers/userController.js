const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Display user create form on GET.
exports.create_user_get = function (req, res) {
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
    .withMessage(
      "Username must only include alpha-numeric characters, and no spaces"
    ),
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
      user: req.user,
    });
  });
};

// Handle User Becoming Member on POST.
exports.become_member_post = [
  // Validate and sanitize fields.
  body("membershipCode").custom((value, { req }) => {
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
      _id: req.user.id,
    });

    if (!errors.isEmpty()) {
      res.render("become-member-form", {
        user: req.user,
        errors: errors.array(),
      });
    } else {
      User.findByIdAndUpdate(req.user.id, user, {}, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

// Display Become Admin form on GET.
exports.become_admin_get = function (req, res, next) {
  User.findById(req.user.id, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user == null) {
      let err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.render("become-admin-form", {
      user: req.user,
    });
  });
};

// Handle User Becoming Admin on POST.
exports.become_admin_post = [
  // Validate and sanitize fields.
  body("adminCode").custom((value, { req }) => {
    console.log(value);

    if (value != 1234) {
      throw new Error("Sorry, the Admin Code was wrong");
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
      admin: true,
      _id: req.user.id,
    });

    if (!errors.isEmpty()) {
      res.render("become-admin-form", {
        username: user.username,
        id: user.id,
        member: user.member,
        errors: errors.array(),
      });
    } else {
      User.findByIdAndUpdate(req.user.id, user, {}, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];
