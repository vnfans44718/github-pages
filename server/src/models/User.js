const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 유저 스키마 정의
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },  // 이메일 인증 여부만 저장
}, { timestamps: true });

// 비밀번호 저장 전에 해싱 처리
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// 모델 등록
module.exports = mongoose.model("User", userSchema);
