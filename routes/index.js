const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Require controllers
let userController = require("../controllers/userController");
let messageController = require("../controllers/messageController");

// GET home page.
router.get("/", function (req, res, next) {
  res.render("index", { title: "Members Only", user: req.user });
});

// GET signup page.
router.get("/sign-up", userController.create_user_get);

// GET Log-in page.
router.get("/log-in", function (req, res, next) {
  res.render("log-in-form");
});

// GET Log-Out page.
router.get("/log-out", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// GET Message page.
router.get("/message", messageController.create_message_get);

// POST signup page.
router.post("/sign-up", userController.create_user_post);

// POST log-in page.
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);

// POST Message page.
router.post("/message", messageController.create_message_post);

module.exports = router;
