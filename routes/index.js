const express = require("express");
const router = express.Router();

// Require controller
let userController = require("../controllers/userController");

// GET home page.
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// GET signup page.
router.get("/sign-up", userController.create_user_get);

// POST signup page.
router.post("/sign-up", userController.create_user_post);

module.exports = router;
