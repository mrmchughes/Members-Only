const express = require("express");
const router = express.Router();
const passport = require("passport");
const async = require("async");

const Message = require("../models/message");

// Require controllers
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

// GET home page.
router.get("/", function (req, res) {
  async.parallel({
    message_count: function (callback) {
      Message.countDocuments({}, callback);
    },
  }),
    function (err, results) {
      res.render("index", {
        title: "Members Only",
        user: req.user,
        messages: results,
      });
    };
});

// GET signup page.
router.get("/sign-up", userController.create_user_get);

// GET Log-in page.
router.get("/log-in", function (req, res) {
  res.render("log-in-form", { user: req.user });
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

// GET Become Member page.
router.get("/become-member", userController.become_member_get);

// GET Become Admin page.
router.get("/become-admin", userController.become_admin_get);

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

// POST Become Member page.
router.post("/become-member", userController.become_member_post);

// POST Become Admin page.
router.post("/become-admin", userController.become_admin_post);

module.exports = router;
