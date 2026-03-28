const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");

const User = require("../models/user");

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("fullName email")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "找不到使用者" });
    }

    return res.json({
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "伺服器發生錯誤" });
  }
  // res.status(204).end();
});

module.exports = router;
