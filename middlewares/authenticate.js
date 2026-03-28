const jwt = require("jsonwebtoken");

//驗證中間件
function authenticate(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ message: "未登入" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = payload.userId;
    next();
  } catch (e) {
    console.error("Token需要續命...😵‍💫");
    return res.status(401).json({ message: "Token 已過期或無效" });
  }
}

module.exports = authenticate;
