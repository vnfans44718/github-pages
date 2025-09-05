const redis = require("../config/redis");
const { generateVerificationCode } = require("../utils/tokenUtils");
const { sendVerificationEmail } = require("../services/emailService");
const User = require("../models/User");
const { generateToken } = require("../utils/tokenUtils");

// ✅ 회원가입 요청 (이메일만 받음 → 인증번호 발송)
exports.verify = async (req, res) => {
  try {
    const { email } = req.body;

    // 이미 가입된 이메일 확인
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "이미 가입된 이메일입니다." });
    }

    // 인증번호 생성 & Redis 저장 (5분 유효)
    const code = generateVerificationCode();
    await redis.setex(`verify:${email}`, 300, code);

    // 이메일 발송
    await sendVerificationEmail(email, code);

    res.status(200).json({ message: "인증번호가 이메일로 발송되었습니다." });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ error: "회원가입 요청 중 오류 발생" });
  }
};

// ✅ 이메일 인증 (인증번호 + 비밀번호 받아 최종 가입)
exports.register = async (req, res) => {
  try {
    const { email, password, code } = req.body;

    // Redis에서 인증번호 확인
    const savedCode = await redis.get(`verify:${email}`);
    if (!savedCode) {
      return res.status(400).json({ error: "인증번호가 만료되었거나 존재하지 않습니다." });
    }

    if (savedCode !== code) {
      return res.status(400).json({ error: "잘못된 인증번호입니다." });
    }

    // ✅ 인증 성공 → MongoDB에 유저 저장
    const user = new User({ email, password, isVerified: true });
    await user.save();

    // 인증 완료 후 Redis 삭제
    await redis.del(`verify:${email}`);

    res.json({ message: "회원가입 완료! 이메일 인증 성공" });
  } catch (err) {
    console.error("❌ Verify Error:", err);
    res.status(500).json({ error: "이메일 인증 중 오류 발생" });
  }
};

// 🟢 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: "이메일 인증 후 로그인 가능합니다." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    const token = generateToken(user._id);
    res.json({ message: "로그인 성공", token });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "로그인 중 오류 발생" });
  }

};
