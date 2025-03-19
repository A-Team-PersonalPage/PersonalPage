const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
    if (err) {
      console.error("토큰 검증 오류:", err);
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
    if (!decoded || !decoded.email || !decoded.id) {
      return res
        .status(401)
        .json({ message: "토큰이 유효하지만 사용자 정보가 없습니다." });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
