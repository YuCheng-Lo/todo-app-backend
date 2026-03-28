const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ message: "找不到此Email" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "錯誤的密碼" });
    }

    //創建JWT(accessToken + refreshToken)
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30m",
      },
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" },
    );

    // 設置 HttpOnly Cookie

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 86400 * 7 * 1000,
      });

    return res.json({
      type: "success",
      message: "成功登入! 歡迎^^",
      user: { fullName: user.fullName, email: user.email },
    });
  } catch (e) {
    console.error(e); // 印出錯誤細節
    res.status(500).send({
      type: "failed",
      message: "伺服器發生錯誤，請稍後再試!或聯絡開發人員。",
    });
  }
};

exports.refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ type: "failed", message: "查無憑證，請先登入!" });
  }

  try {
    //驗證refresh Token 是否有效
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

    //發一個新的access token
    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });

    return res.json({ type: "success", message: "Access Token已續命😮‍💨" });
  } catch (e) {
    console.error("Refresh Token已不幸殞命...", e);
    return res
      .status(403)
      .json({ type: "failed", message: "Refresh token 無效或過期" });
  }
};

exports.register = async (req, res) => {
  try {
    const { fullName, age, email, password } = req.body;
    //檢查是否已註冊
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "此Email已被註冊" });
    }
    //密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    //建立新用戶
    const newUser = new User({
      fullName,
      age,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    //回傳結果
    res.json({ message: "註冊成功" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ message: "登出成功" });
};
