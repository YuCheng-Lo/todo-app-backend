const express = require("express");
const router = express.Router();

const {
  login,
  refresh,
  register,
  logout,
} = require("../controllers/authController");

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/register", register);

router.post("/logout", logout);

module.exports = router;
