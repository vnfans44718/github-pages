const jwt = require("jsonwebtoken");

// JWT 토큰 발급
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,   // .env에 꼭 JWT_SECRET 있어야 함
    { expiresIn: "1h" }       // 만료 시간 1시간
  );
}

// 6자리 인증번호 생성
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { generateToken, generateVerificationCode };
